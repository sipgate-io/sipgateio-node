import { ContactsDTO } from '../core/models/contacts.model';
import { ContactsModule } from './contacts.module';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule, HttpError } from '../core/httpClient';
import handleCoreError from '../core/errors/handleCoreError';

export const createContactsModule = (
	client: HttpClientModule
): ContactsModule => ({
	async importFromCsvString(content: string): Promise<void> {
		const csvLinesForUpload = parseAndCheckCSV(content);

		console.log(csvLinesForUpload);

		const encoded = btoa(csvLinesForUpload);

		const contactsDTO: ContactsDTO = { base64Content: encoded };

		await client
			.post('/contacts/import/csv', contactsDTO)
			.catch(error => Promise.reject(handleError(error)));
	},
});

export const parseAndCheckCSV = (content: string): string => {
	const csvLines: string[] = content.split(/\n|\r\n/);
	if (csvLines.length < 2) {
		throw new Error(ErrorMessage.CONTACTS_INVALID_CSV);
	}
	const csvHeader = csvLines[0].split(',');
	const firstnameIndex = csvHeader.findIndex(
		value => value.toLowerCase() === 'firstname'
	);
	const lastnameIndex = csvHeader.findIndex(
		value => value.toLowerCase() === 'lastname'
	);
	const numberIndex = csvHeader.findIndex(
		value => value.toLowerCase() === 'number'
	);
	const maxIndex = Math.max(firstnameIndex, lastnameIndex, numberIndex);

	csvLines.shift();

	const lines = csvLines
		.map(value => value.split(','))
		.filter(columns => columns.length >= maxIndex)
		.map(
			columns =>
				`${columns[firstnameIndex]},${columns[lastnameIndex]},${columns[numberIndex]}`
		)
		.join('\n');

	return `firstname,lastname,number\n${lines}`;
};

const handleError = (error: HttpError): Error => {
	if (!error.response) {
		return error;
	}

	return handleCoreError(error);
};
