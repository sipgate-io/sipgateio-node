import { ContactsModule } from './contacts.module';
import { ErrorMessage } from './errors/ErrorMessage';
import { HttpClientModule } from '../core/httpClient';
import { ImportCSVRequestDTO } from './models/contacts.model';
import { createContactsModule } from './contacts';
import {
	example,
	exampleWithTwoAdresses,
	exampleWithoutEmail,
} from './contacts.test.examples';
import { parseVCard } from './helpers/vCardHelper';
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
			.mockImplementation((_, contactsDTO: ImportCSVRequestDTO) => {
				csvContent = atob(contactsDTO.base64Content);
				return Promise.resolve({
					status: 204,
				});
			});
		contactsModule = createContactsModule(mockClient);
	});

	it.each`
		input                                                                                               | expected
		${'firstname,lastname,number\nAlan,Turing,+4921163553355'}                                          | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'lastname,firstname,number\nTuring,Alan,+4921163553355'}                                          | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,firstname,lastname\n+4921163553355,Alan,Turing'}                                          | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'firstname,number,lastname\nAlan,+4921163553355,Turing'}                                          | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'lastname,number,firstname\nTuring,+4921163553355,Alan'}                                          | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,firstname\n+4921163553355,Turing,Alan'}                                          | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'Firstname,Lastname,Number\nAlan,Turing,+4921163553355'}                                          | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'alias,number,lastname,firstname\nEnigma,+4921163553355,Turing,Alan'}                             | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,alias,firstname\n+4921163553355,Turing,Enigma,Alan'}                             | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,firstname,alias\n+4921163553355,Turing,Alan,Enigma'}                             | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'alias,number,lastname,firstname\n,+4921163553355,Turing,Alan'}                                   | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,alias,firstname\n+4921163553355,Turing,,Alan'}                                   | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'number,lastname,firstname,alias\n+4921163553355,Turing,Alan,'}                                   | ${'firstname,lastname,number\nAlan,Turing,+4921163553355'}
		${'\nnumber,lastname,firstname,alias\n\n+4921163553355,Turing,Alan,\n+4921163553355,Lovelace,Ada,'} | ${'firstname,lastname,number\nAlan,Turing,+4921163553355\nAda,Lovelace,+4921163553355'}
	`('should parse csv successfully', async ({ input, expected }) => {
		await contactsModule.importFromCsvString(input);
		expect(csvContent).toEqual(expected);
	});

	it.each`
		input                                          | expected
		${'firstname,lastname\nm,turing\nd,foo,dummy'} | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'firstname,number\nm,turing\nd,foo,dummy'}   | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\nfirstname,lastname,\nd,foo,dummy'}        | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'lastname,number\nm,turing\nd,foo,dummy'}    | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'foo,dummy,bar\nm,turing\nd,foo,dummy'}      | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\nm,turing\nd,foo,dummy'}                   | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\n\nd,foo,dummy'}                           | ${ErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
	`(
		'throws $expected when $input is given (some fields are missing)',
		async ({ input, expected }) => {
			await expect(
				contactsModule.importFromCsvString(input)
			).rejects.toThrowError(expected);
		}
	);

	it.each`
		input                                                        | expected
		${'firstname,lastname,number\nm,turing,000\na,000\na,b,000'} | ${ErrorMessage.CONTACTS_MISSING_VALUES}
		${'firstname,lastname,number\nm,turing,000\na,000,200\na,b'} | ${ErrorMessage.CONTACTS_MISSING_VALUES}
		${'firstname,lastname,number\nturing,000\na,000,c\na,b,000'} | ${ErrorMessage.CONTACTS_MISSING_VALUES}
	`(
		'throws $expected when $input is given (some rows missing values)',
		async ({ input, expected }) => {
			await expect(
				contactsModule.importFromCsvString(input)
			).rejects.toThrowError(expected);
		}
	);

	it.each`
		input | expected
		${''} | ${ErrorMessage.CONTACTS_INVALID_CSV}
	`('throws $expected when $input is given', async ({ input, expected }) => {
		await expect(
			contactsModule.importFromCsvString(input)
		).rejects.toThrowError(expected);
	});
});

describe('Contacts Module', () => {
	it('parses a valid vCard', () => {
		expect(() => parseVCard(example)).not.toThrowError();
	});

	it('throws an Error if the Names of the vCard Contact are not given', () => {
		expect(() =>
			parseVCard('BEGIN:VCARD\r\nVERSION:4.0\r\nEND:VCARD\r\n')
		).toThrowError('Names not given');
	});

	it('throws an Error if the Version is not 4.0', () => {
		expect(() =>
			parseVCard(example.replace('VERSION:4.0', 'VERSION:2.1'))
		).toThrowError('Invalid VCard Version given');
	});

	it('throws an Error if no phone number is given', () => {
		expect(() =>
			parseVCard(
				'BEGIN:VCARD\r\nVERSION:4.0\r\nN:Doe;John;Mr.;\r\nEND:VCARD\r\n'
			)
		).toThrowError('No phone number given');
	});

	it('throws an Error if multiple phone numbers are given', () => {
		expect(() =>
			parseVCard(
				'BEGIN:VCARD\r\nVERSION:4.0\r\nN:Doe;John;Mr.;\r\nTEL;type=HOME:+1 202 555 1212\r\nTEL;type=WORK:+1 202 555 1212\r\nEND:VCARD\r\n'
			)
		).toThrowError('Only one phone number is allowed');
	});

	it('throws an Error if multiple email adresses are given', () => {
		expect(() =>
			parseVCard(
				'BEGIN:VCARD\r\nVERSION:4.0\r\nN:Doe;John;Mr.;\r\nTEL;type=WORK:+1 202 555 1212\r\nEMAIL;type=INTERNET;type=WORK;type=pref:johnDoe@example.org\r\nEMAIL;type=INTERNET;type=WORK;type=pref:johnDoe@example.org\r\nEND:VCARD\r\n'
			)
		).toThrowError('Only one email is allowed');
	});

	it('throws an Error if multiple addresses are given', () => {
		expect(() => parseVCard(exampleWithTwoAdresses)).toThrowError(
			'Only one address is allowed'
		);
	});

	it('returns the correct parsed json', () => {
		expect(parseVCard(example)).toEqual({
			firstname: 'John',
			lastname: 'Doe',
			phoneNumber: '+1 202 555 1212',
			email: 'johnDoe@example.org',
			address: {
				country: 'USA',
				locality: 'Worktown',
				postalCode: '01111',
				region: 'NY',
				streetAddress: '2 Enterprise Avenue',
			},
		});
	});

	it('returns the correct parsed json without email', () => {
		expect(parseVCard(exampleWithoutEmail)).toEqual({
			firstname: 'John',
			lastname: 'Doe',
			phoneNumber: '+1 202 555 1212',
			email: undefined,
			address: {
				country: 'USA',
				locality: 'Worktown',
				postalCode: '01111',
				region: 'NY',
				streetAddress: '2 Enterprise Avenue',
			},
		});
	});
});
