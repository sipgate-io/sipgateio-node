import { ContactsDTO } from '../core/models/contacts.model';
import { ContactsModule } from './contacts.module';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { createContactsModule } from './contacts';
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

	it.each`
		input                                           | expected
		${'firstname,lastname\nm,turing\nd,foo,dummy`'} | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS}
		${`firstname,number\nm,turing\nd,foo,dummy`}    | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS}
		${'\nfirstname,lastname,\nd,foo,dummy`'}        | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS}
		${'lastname,number\nm,turing\nd,foo,dummy`'}    | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS}
		${'foo,dummy,bar\nm,turing\nd,foo,dummy`'}      | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS}
		${'\nm,turing\nd,foo,dummy`'}                   | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS}
		${'\n\nd,foo,dummy`'}                           | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELDS}
	`(
		'throws $expected when $input is given (some values are missing)',
		({ input, expected }) => {
			expect(contactsModule.importFromCsvString(input)).rejects.toThrowError(
				expected
			);
		}
	);

	it.each`
		input                                                        | expected
		${'firstname,lastname,number\nm,turing,000\na,000\na,b,000'} | ${ErrorMessage.CONTACTS_MISSING_VALUES}
		${'firstname,lastname,number\nm,turing,000\na,000,200\na,b'} | ${ErrorMessage.CONTACTS_MISSING_VALUES}
		${'firstname,lastname,number\nturing,000\na,000,c\na,b,000'} | ${ErrorMessage.CONTACTS_MISSING_VALUES}
		${'firstname,lastname,number\n,,\n\n'}                       | ${ErrorMessage.CONTACTS_MISSING_VALUES}
	`(
		'throws $expected when $input is given (some values are missing)',
		({ input, expected }) => {
			expect(contactsModule.importFromCsvString(input)).rejects.toThrowError(
				expected
			);
		}
	);
});
