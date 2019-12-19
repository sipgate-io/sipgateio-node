import { ContactsDTO, ContactsModule } from './contacts.module';
import { ErrorMessage } from './errors/ErrorMessage';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { ImportCSVRequestDTO } from './models/contacts.model';
import { parseVCard } from './helpers/vCardHelper';
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
	async importVCardString(
		vCardContent: string,
		scope: 'PRIVATE' | 'SHARED'
	): Promise<void> {
		const parsedVcard = parseVCard(vCardContent);

		const addresses = [];
		if (parsedVcard.address) {
			addresses.push(parsedVcard.address);
		}
		const emails = [];
		if (parsedVcard.email) {
			emails.push({
				email: parsedVcard.email,
				type: [],
			});
		}

		const contactsDTO: ContactsDTO = {
			name: `${parsedVcard.firstname} ${parsedVcard.lastname}`,
			family: parsedVcard.lastname,
			given: parsedVcard.firstname,
			organization: [parsedVcard.organization],
			picture: null,
			scope,
			addresses,
			emails,
			numbers: [
				{
					number: parsedVcard.phoneNumber,
					type: [],
				},
			],
		};
		await client
			.post('/contacts', contactsDTO)
			.catch(error => Promise.reject(handleError(error)));
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
