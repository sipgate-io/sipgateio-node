import { ContactIndize, ContactsModule } from './contacts.module';
import { ContactsDTO } from '../core/models/contacts.model';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule, HttpError } from '../core/httpClient';
import handleCoreError from '../core/errors/handleCoreError';

export const createContactsModule = (
	client: HttpClientModule
): ContactsModule => ({
	async importFromCsvString(content: string): Promise<void> {
		const contactsDTO = encodeCsvString(content);
		await client
			.post('/contacts/import/csv', contactsDTO)
			.catch(error => Promise.reject(handleError(error)));
	},
});

const encodeCsvString = (content: string): ContactsDTO => {
	const csvLines: string[] = content.split(/\n|\r\n/);

	const csvLinesForUpload = parseAndCheckCSV(csvLines);

	const encoded = btoa(csvLinesForUpload);

	const contactsDTO: ContactsDTO = { base64Content: encoded };
	return contactsDTO;
};

const getCsvHeader = (csvLines: string[]): string[] => {
	return csvLines[0].split(',');
};

const findIgnoreCaseIndex = (array: string[], needle: string): number => {
	return array.findIndex(value => value.toLowerCase() === needle.toLowerCase());
};

export const parseAndCheckCSV = (csvLines: string[]): string => {
	if (csvLines.length < 2) {
		throw new Error(ErrorMessage.CONTACTS_INVALID_CSV);
	}

	const csvHeader: string[] = getCsvHeader(csvLines);
	const contactIndize: ContactIndize = {
		firstname: findIgnoreCaseIndex(csvHeader, 'firstname'),
		lastname: findIgnoreCaseIndex(csvHeader, 'lastname'),
		number: findIgnoreCaseIndex(csvHeader, 'number'),
	};

	if (Object.values(contactIndize).filter(value => value < 0).length !== 0) {
		throw Error(ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS);
	}

	csvLines.shift();

	const maxIndizeLength = Math.max(
		contactIndize.firstname,
		contactIndize.lastname,
		contactIndize.number
	);

	const lines = csvLines
		.map(value => value.split(','))
		.filter(columns => columns.length >= maxIndizeLength)
		.map(columns => {
			if (columns.length >= maxIndizeLength + 1) {
				return `${columns[contactIndize.firstname]},${
					columns[contactIndize.lastname]
				},${columns[contactIndize.number]}`;
			}
			throw Error(ErrorMessage.CONTACTS_MISSING_VALUES);
		})
		.join('\n');

	return `firstname,lastname,number\n${lines}`;
};

const handleError = (error: HttpError): Error => {
	if (!error.response) {
		return error;
	}

	if (error.response.status === 500) {
		return Error(`${ErrorMessage.CONTACTS_INVALID_CSV}`);
	}

	return handleCoreError(error);
};
