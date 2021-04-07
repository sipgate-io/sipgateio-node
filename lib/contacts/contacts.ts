import { ContactImport } from './helpers/Address';
import {
	ContactResponse,
	ContactUpdate,
	ContactsDTO,
	ContactsListResponse,
	ContactsModule,
	ImportCSVRequestDTO,
} from './contacts.types';
import {
	ContactsErrorMessage,
	handleContactsError,
} from './errors/handleContactsError';
import { Parser } from 'json2csv';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { createVCards, parseVCard } from './helpers/vCardHelper';
import { toBase64 } from '../utils';

export const createContactsModule = (
	client: SipgateIOClient
): ContactsModule => ({
	async importFromCsvString(csvContent: string): Promise<void> {
		const projectedCsv = projectCsvString(csvContent);
		const base64EncodedCsv = toBase64(projectedCsv);
		const contactsDTO: ImportCSVRequestDTO = {
			base64Content: base64EncodedCsv,
		};

		await client
			.post('/contacts/import/csv', contactsDTO)
			.catch((error) => Promise.reject(handleContactsError(error)));
	},

	async create(contact, scope): Promise<void> {
		const {
			firstname,
			lastname,
			organization,
			address,
			email,
			phone,
		} = contact;

		if (firstname === '' && lastname === '') {
			throw new Error(ContactsErrorMessage.CONTACTS_MISSING_NAME_ATTRIBUTE);
		}
		const contactsDTO: ContactsDTO = {
			name: `${firstname} ${lastname}`,
			family: lastname,
			given: firstname,
			organization: organization ? organization : [],
			picture: null,
			scope,
			addresses: address ? [address] : [],
			emails: email ? [email] : [],
			numbers: phone ? [phone] : [],
		};
		await client
			.post('/contacts', contactsDTO)
			.catch((error) => Promise.reject(handleContactsError(error)));
	},

	async update(contact: ContactUpdate): Promise<void> {
		await client
			.put(`/contacts/${contact.id}`, contact)
			.catch((error) => Promise.reject(handleContactsError(error)));
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
			organization: parsedVCard.organization,
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
			.catch((error) => Promise.reject(handleContactsError(error)));
	},

	async exportAsCsv(
		scope,
		delimiter = ',',
		pagination,
		filter
	): Promise<string> {
		const contactsResponse = await client.get<ContactsListResponse>(
			`contacts`,
			{
				params: {
					...pagination,
					...filter,
				},
			}
		);

		contactsResponse.items = contactsResponse.items.filter(
			(contact) => contact.scope === scope
		);

		const fields = [
			'id',
			'name',
			'emails',
			'numbers',
			'addresses',
			'organizations',
		];
		const opts = { fields, delimiter };
		const elements = contactsResponse.items.map((contact) => {
			return {
				id: contact.id,
				name: contact.name,
				emails: contact.emails.map((email) => email.email),
				numbers: contact.numbers.map((number) => number.number),
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
	async get(scope, pagination, filter): Promise<ContactResponse[]> {
		const contactsResponse = await client.get<ContactsListResponse>(
			`contacts`,
			{
				params: {
					...pagination,
					...filter,
				},
			}
		);
		contactsResponse.items = contactsResponse.items.filter(
			(contact) => contact.scope === scope
		);
		return contactsResponse.items;
	},

	async exportAsSingleVCard(scope, pagination, filter): Promise<string> {
		const vCards = await this.exportAsVCards(scope, pagination, filter);
		return vCards.join('\r\n');
	},
	async exportAsVCards(scope, pagination, filter): Promise<string[]> {
		const contactsResponse = await client.get<ContactsListResponse>(
			`contacts`,
			{
				params: {
					...pagination,
					...filter,
				},
			}
		);

		contactsResponse.items = contactsResponse.items.filter(
			(contact) => contact.scope === scope
		);

		const contacts = contactsResponse.items.map<ContactImport>((contact) => {
			return {
				firstname: contact.name,
				lastname: '',
				organizations: contact.organization,
				phoneNumbers: contact.numbers,
				emails: contact.emails,
				addresses: contact.addresses.map((address) => {
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
		throw new Error(
			`${ContactsErrorMessage.CONTACTS_MISSING_HEADER_FIELD}: ${needle}`
		);
	}
	return index;
};

const projectCsvString = (csvString: string): string => {
	const csvLines: string[] = csvString
		.split(/\n|\r\n/)
		.filter((line) => line !== '');

	if (csvLines.length < 1) {
		throw new Error(ContactsErrorMessage.CONTACTS_INVALID_CSV);
	}

	if (csvLines.length < 2) {
		console.log('WARNING: no lines to import');
	}

	const csvHeader: string[] = csvLines[0]
		.split(',')
		.map((header) => header.toLowerCase());
	const columnIndices = {
		firstname: findColumnIndex(csvHeader, 'firstname'),
		lastname: findColumnIndex(csvHeader, 'lastname'),
		number: findColumnIndex(csvHeader, 'number'),
	};

	csvLines.shift();

	const lines = csvLines
		.map((lines) => lines.split(','))
		.map((columns, index) => {
			if (columns.length !== csvHeader.length) {
				throw Error(ContactsErrorMessage.CONTACTS_MISSING_VALUES);
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
