import { ContactsDTO } from '../core/models/contacts.model';
import { ContactsModule } from './contacts.module';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { createContactsModule, parseCsvString } from './contacts';
import atob from 'atob';

describe('Call Module', () => {
	let contactsModule: ContactsModule;
	let mockClient: HttpClientModule;

	beforeEach(() => {
		mockClient = {} as HttpClientModule;
		contactsModule = createContactsModule(mockClient);
	});

	it('should parse csv with extra fields successfully', async () => {
		let csvContent = '';
		mockClient.post = jest
			.fn()
			.mockImplementation((_, contactsDTO: ContactsDTO) => {
				csvContent = atob(contactsDTO.base64Content);
				return Promise.resolve({
					status: 204,
				});
			});

		const excessiveValidCsv = `gender,lastname,firstname,number\nm,turing,theodor,number`;
		const expected = `firstname,lastname,number\ntheodor,turing,number`;

		await contactsModule.importFromCsvString(excessiveValidCsv);
		expect(csvContent).toEqual(expected);
	});

	it('should print an Error, if the header does not contain "firstname","lastname" and "number"', () => {
		const EXAMPLE_STRING = `firstname,number\nm,turing\nd,foo,dummy`;

		expect(() => parseCsvString(EXAMPLE_STRING)).toThrowError(
			ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS
		);
	});

	it('should print an Error, if one value is missing in the CSV-Columns', () => {
		const EXAMPLE_STRING = `firstname,lastname,number\nm,turing,000\na,000\na,b,000`;

		expect(() => parseCsvString(EXAMPLE_STRING)).toThrowError(
			ErrorMessage.CONTACTS_MISSING_VALUES
		);
	});
});
