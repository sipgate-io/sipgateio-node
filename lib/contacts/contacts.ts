import { ContactIndices, ContactsModule } from './contacts.module';
import { ContactsDTO } from '../core/models/contacts.model';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule, HttpError } from '../core/httpClient';
import handleCoreError from '../core/errors/handleCoreError';

export const createContactsModule = (
	client: HttpClientModule
): ContactsModule => ({
	async importFromCsvString(content: string): Promise<void> {
		const parsedCsv = parseCsvString(content);
		const encodedCsv = btoa(parsedCsv);
		const contactsDTO: ContactsDTO = { base64Content: encodedCsv };

		await client
			.post('/contacts/import/csv', contactsDTO)
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

export const parseCsvString = (csvString: string): string => {
	const csvLines: string[] = csvString.split(/\n|\r\n/);

	if (csvLines.length < 2) {
		throw new Error(ErrorMessage.CONTACTS_INVALID_CSV);
	}

	const csvHeader: string[] = csvLines[0]
		.split(',')
		.map(header => header.toLowerCase());
	const columnIndices: ContactIndices = {
		firstname: findColumnIndex(csvHeader, 'firstname'),
		lastname: findColumnIndex(csvHeader, 'lastname'),
		number: findColumnIndex(csvHeader, 'number'),
	};

	csvLines.shift();

	const lines = csvLines
		.map(lines => lines.split(','))
		.map(columns => {
			if (columns.length !== csvHeader.length) {
				throw Error(ErrorMessage.CONTACTS_MISSING_VALUES);
			}
			return [
				columns[columnIndices.firstname],
				columns[columnIndices.lastname],
				columns[columnIndices.number],
			].join(',');
		});

	return ['firstname,lastname,number', ...lines].join('\n');
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
