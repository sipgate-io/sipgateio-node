import { ContactsDTO } from '../core/models/contacts.model';
import { ContactsModule } from './contacts.module';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { createContactsModule } from './contacts';
import atob from 'atob';

describe('Contacts Module', () => {
	let contactsModule: ContactsModule;
	let mockClient: HttpClientModule;

	let csvContent: string;

	beforeEach(() => {
		csvContent = '';
		mockClient = {} as HttpClientModule;
		mockClient.post = jest
			.fn()
			.mockImplementation((_, contactsDTO: ContactsDTO) => {
				csvContent = atob(contactsDTO.base64Content);
				return Promise.resolve({
					status: 204,
				});
			});
		contactsModule = createContactsModule(mockClient);
	});

	it.each`
		input                                                                   | expected
		${'firstname,lastname,number\nAlan,Turing,+4921163553355'}              | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'lastname,firstname,number\nTuring,Alan,+4921163553355'}              | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,firstname,lastname\n+4921163553355,Alan,Turing'}              | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'firstname,number,lastname\nAlan,+4921163553355,Turing'}              | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'lastname,number,firstname\nTuring,+4921163553355,Alan'}              | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,firstname\n+4921163553355,Turing,Alan'}              | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'Firstname,Lastname,Number\nAlan,Turing,+4921163553355'}              | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'alias,number,lastname,firstname\nEnigma,+4921163553355,Turing,Alan'} | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,alias,firstname\n+4921163553355,Turing,Enigma,Alan'} | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,firstname,alias\n+4921163553355,Turing,Alan,Enigma'} | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'alias,number,lastname,firstname\n,+4921163553355,Turing,Alan'}       | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,alias,firstname\n+4921163553355,Turing,,Alan'}       | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,firstname,alias\n+4921163553355,Turing,Alan,'}       | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
	`('should parse csv successfully', async ({ input, expected }) => {
		await contactsModule.importFromCsvString(input);
		expect(csvContent).toEqual(expected);
	});

	it.each`
		input                                           | expected
		${'firstname,lastname\nm,turing\nd,foo,dummy`'} | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${`firstname,number\nm,turing\nd,foo,dummy`}    | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\nfirstname,lastname,\nd,foo,dummy`'}        | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'lastname,number\nm,turing\nd,foo,dummy`'}    | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'foo,dummy,bar\nm,turing\nd,foo,dummy`'}      | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\nm,turing\nd,foo,dummy`'}                   | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\n\nd,foo,dummy`'}                           | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
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
