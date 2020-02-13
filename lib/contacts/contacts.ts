import { ContactImport } from './helpers/Address';
import {
	ContactRequest,
	ContactsDTO,
	ContactsModule,
	ContactsRequest,
} from './contacts.module';
import { ErrorMessage } from './errors/ErrorMessage';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { ImportCSVRequestDTO } from './models/contacts.model';
import { Parser } from 'json2csv';
import { createVCards, parseVCard } from './helpers/vCardHelper';
import btoa from 'btoa';
import handleCoreError from '../core/errors/handleError';

export const createContactsModule = (
	client: HttpClientModule
): ContactsModule => ({
	async importFromCsvString(csvContent: string): Promise<void> {
		const projectedCsv = projectCsvString(csvContent);
		const base64EncodedCsv = btoa(projectedCsv);
		const contactsDTO: ImportCSVRequestDTO = {
			base64Content: base64EncodedCsv,
		};

		await client
			.post('/contacts/import/csv', contactsDTO)
			.catch(error => Promise.reject(handleError(error)));
	},

	async import(contact, scope): Promise<void> {
		const {
			firstname,
			lastname,
			organization,
			address,
			email,
			phone,
		} = contact;

		if (firstname === '' && lastname === '') {
			throw new Error(ErrorMessage.CONTACTS_MISSING_NAME_ATTRIBUTE);
		}
		const contactsDTO: ContactsDTO = {
			name: `${firstname} ${lastname}`,
			family: lastname,
			given: firstname,
			organization: organization ? [organization] : [],
			picture: null,
			scope,
			addresses: address ? [address] : [],
			emails: email ? [email] : [],
			numbers: phone ? [phone] : [],
		};
		await client
			.post('/contacts', contactsDTO)
			.catch(error => Promise.reject(handleError(error)));
	},

	async importVCardString(vCardContent: string, scope): Promise<void> {
		const parsedVCard = parseVCard(vCardContent);

		const addresses = [];
		if (parsedVCard.address) {
			addresses.push(parsedVCard.address);
		}
		const emails = [];
		if (parsedVCard.email) {
			emails.push({
				email: parsedVCard.email,
				type: [],
			});
		}

		const contactsDTO: ContactsDTO = {
			name: `${parsedVCard.firstname} ${parsedVCard.lastname}`,
			family: parsedVCard.lastname,
			given: parsedVCard.firstname,
			organization: [parsedVCard.organization],
			picture: null,
			scope,
			addresses,
			emails,
			numbers: [
				{
					number: parsedVCard.phoneNumber,
					type: [],
				},
			],
		};
		await client
			.post('/contacts', contactsDTO)
			.catch(error => Promise.reject(handleError(error)));
	},

	async exportAsCsv(scope): Promise<string> {
		const contactsRequest = await client.get<ContactsRequest>(`contacts`);

		contactsRequest.data.items = contactsRequest.data.items.filter(
			contact => contact.scope === scope
		);

		const fields = [
			'id',
			'name',
			'emails',
			'numbers',
			'addresses',
			'organizations',
		];
		const opts = { fields };
		const elements = contactsRequest.data.items.map(contact => {
			return {
				id: contact.id,
				name: contact.name,
				emails: contact.emails.map(email => email.email),
				numbers: contact.numbers.map(number => number.number),
				addresses: contact.addresses,
				organizations: contact.organization,
			};
		});
		try {
			const parser = new Parser(opts);
			return parser.parse(elements);
		} catch (err) {
			throw Error(err);
		}
	},
	async exportAsObjects(scope): Promise<ContactRequest[]> {
		const contactsRequest = await client.get<ContactsRequest>(`contacts`);
		contactsRequest.data.items = contactsRequest.data.items.filter(
			contact => contact.scope === scope
		);
		return contactsRequest.data.items;
	},

	async exportAsSingleVCard(scope): Promise<string> {
		const vCards = await this.exportAsVCards(scope);
		return vCards.join('\r\n');
	},
	async exportAsVCards(scope): Promise<string[]> {
		const contactsRequest = await client.get<ContactsRequest>(`contacts`);

		contactsRequest.data.items = contactsRequest.data.items.filter(
			contact => contact.scope === scope
		);

		const contacts = contactsRequest.data.items.map<ContactImport>(contact => {
			return {
				firstname: contact.name,
				lastname: '',
				organizations: contact.organization,
				phoneNumbers: contact.numbers,
				emails: contact.emails,
				addresses: contact.addresses.map(address => {
					return {
						...address,
						type: ['home'],
					};
				}),
			};
		});

		return createVCards(contacts);
	},
});

const findColumnIndex = (array: string[], needle: string): number => {
	const index = array.indexOf(needle);
	if (index < 0) {
		throw new Error(`${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}: ${needle}`);
	}
	return index;
};

const projectCsvString = (csvString: string): string => {
	const csvLines: string[] = csvString
		.split(/\n|\r\n/)
		.filter(line => line !== '');

	if (csvLines.length < 1) {
		throw new Error(ErrorMessage.CONTACTS_INVALID_CSV);
	}

	if (csvLines.length < 2) {
		console.log('WARNING: no lines to import');
	}

	const csvHeader: string[] = csvLines[0]
		.split(',')
		.map(header => header.toLowerCase());
	const columnIndices = {
		firstname: findColumnIndex(csvHeader, 'firstname'),
		lastname: findColumnIndex(csvHeader, 'lastname'),
		number: findColumnIndex(csvHeader, 'number'),
	};

	csvLines.shift();

	const lines = csvLines
		.map(lines => lines.split(','))
		.map((columns, index) => {
			if (columns.length !== csvHeader.length) {
				throw Error(ErrorMessage.CONTACTS_MISSING_VALUES);
			}

			const firstname = columns[columnIndices.firstname];
			const lastname = columns[columnIndices.lastname];
			const number = columns[columnIndices.number];

			if (!(firstname && lastname && number)) {
				console.log(`WARNING: record at position ${index + 1} is empty`);
				return '';
			}

			return [firstname, lastname, number].join(',');
		});

	return ['firstname,lastname,number', ...lines].join('\n');
};

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 500) {
		return Error(`${ErrorMessage.CONTACTS_INVALID_CSV}`);
	}

	return handleCoreError(error);
};
