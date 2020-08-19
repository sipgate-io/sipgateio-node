/* eslint-disable no-unused-vars */
import {
	ContactsDTO,
	ContactsModule,
	ImportCSVRequestDTO,
} from './contacts.types';
import { ContactsErrorMessage } from './errors/handleContactsError';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { createContactsModule } from './contacts';
import { createVCards, parseVCard } from './helpers/vCardHelper';
import {
	example,
	exampleWithAllValues,
	exampleWithTwoAdresses,
	exampleWithTwoOrganizations,
	exampleWithoutEmail,
} from './contacts.test.examples';
import atob from 'atob';

describe('Contacts Module', () => {
	let contactsModule: ContactsModule;
	let mockClient: SipgateIOClient;

	beforeEach(() => {
		mockClient = {} as SipgateIOClient;
		mockClient.post = jest
			.fn()
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.mockImplementation((_, _contactsDTO: ContactsDTO) => {
				return Promise.resolve({
					status: 204,
				});
			});
		contactsModule = createContactsModule(mockClient);
	});

	it('throws $expected when $input is given (some fields are missing)', async () => {
		await expect(
			contactsModule.create(
				{
					firstname: '',
					lastname: '',
				},
				'PRIVATE'
			)
		).rejects.toThrowError(
			ContactsErrorMessage.CONTACTS_MISSING_NAME_ATTRIBUTE
		);
	});

	it.each`
		input | expected
		${{
	firstname: 'Vorname',
	lastname: 'Nachname',
}} | ${undefined}
		${{
	firstname: 'Vorname',
	lastname: 'Nachname',
	phone: { number: '+4912121212', type: [] },
}} | ${undefined}
		${{
	firstname: 'Vorname',
	lastname: 'Nachname',
	email: { mail: 'test@sipgate.de', type: [] },
}} | ${undefined}
		${{
	firstname: 'Vorname',
	lastname: 'Nachname',
	organization: ['companyExample'],
}} | ${undefined}
		${{
	firstname: 'Vorname',
	lastname: 'Nachname',
	phone: { number: '+4912121212', type: [] },
	email: { mail: 'test@sipgate.de', type: [] },
	organization: ['companyExample'],
}} | ${undefined}
	`('does not throw when correct values are given', async ({ input }) => {
		await expect(
			contactsModule.create(input, 'PRIVATE')
		).resolves.not.toThrow();
	});
});

describe('Contacts Module by CSV', () => {
	let contactsModule: ContactsModule;
	let mockClient: SipgateIOClient;

	let csvContent: string;

	beforeEach(() => {
		csvContent = '';
		mockClient = {} as SipgateIOClient;
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
		${'firstname,lastname\nm,turing\nd,foo,dummy'} | ${ContactsErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'firstname,number\nm,turing\nd,foo,dummy'}   | ${ContactsErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\nfirstname,lastname,\nd,foo,dummy'}        | ${ContactsErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'lastname,number\nm,turing\nd,foo,dummy'}    | ${ContactsErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'foo,dummy,bar\nm,turing\nd,foo,dummy'}      | ${ContactsErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\nm,turing\nd,foo,dummy'}                   | ${ContactsErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
		${'\n\nd,foo,dummy'}                           | ${ContactsErrorMessage.CONTACTS_MISSING_HEADER_FIELD}
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
		${'firstname,lastname,number\nm,turing,000\na,000\na,b,000'} | ${ContactsErrorMessage.CONTACTS_MISSING_VALUES}
		${'firstname,lastname,number\nm,turing,000\na,000,200\na,b'} | ${ContactsErrorMessage.CONTACTS_MISSING_VALUES}
		${'firstname,lastname,number\nturing,000\na,000,c\na,b,000'} | ${ContactsErrorMessage.CONTACTS_MISSING_VALUES}
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
		${''} | ${ContactsErrorMessage.CONTACTS_INVALID_CSV}
	`('throws $expected when $input is given', async ({ input, expected }) => {
		await expect(
			contactsModule.importFromCsvString(input)
		).rejects.toThrowError(expected);
	});
});

describe('Contacts Module by vCard', () => {
	it('parses a valid vCard', () => {
		expect(() => parseVCard(example)).not.toThrowError();
	});

	it('throws an Error if the vCard does not have a valid starting tag', () => {
		expect(() => parseVCard('VERSION:4.0\r\nEND:VCARD\r\n')).toThrowError(
			ContactsErrorMessage.CONTACTS_VCARD_MISSING_BEGIN
		);
	});

	it('throws an Error if the vCard does not have a valid ending tag', () => {
		expect(() => parseVCard('BEGIN:VCARD\r\nVERSION:4.0\r\n\r\n')).toThrowError(
			ContactsErrorMessage.CONTACTS_VCARD_MISSING_END
		);
	});

	it('throws an Error if the Names of the vCard Contact are not given', () => {
		expect(() =>
			parseVCard('BEGIN:VCARD\r\nVERSION:4.0\r\nEND:VCARD\r\n')
		).toThrowError(ContactsErrorMessage.CONTACTS_MISSING_NAME_ATTRIBUTE);
	});

	it('throws an Error if the Version is not 4.0', () => {
		expect(() =>
			parseVCard(example.replace('VERSION:4.0', 'VERSION:2.1'))
		).toThrowError(ContactsErrorMessage.CONTACTS_INVALID_VCARD_VERSION);
	});

	it('throws an Error if no phone number is given', () => {
		expect(() =>
			parseVCard(
				'BEGIN:VCARD\r\nVERSION:4.0\r\nN:Doe;John;Mr.;\r\nEND:VCARD\r\n'
			)
		).toThrowError(ContactsErrorMessage.CONTACTS_MISSING_TEL_ATTRIBUTE);
	});

	it('throws an Error if multiple phone numbers are given', () => {
		expect(() =>
			parseVCard(
				'BEGIN:VCARD\r\nVERSION:4.0\r\nN:Doe;John;Mr.;\r\nTEL;type=HOME:+1 202 555 1212\r\nTEL;type=WORK:+1 202 555 1212\r\nEND:VCARD\r\n'
			)
		).toThrowError(
			ContactsErrorMessage.CONTACTS_INVALID_AMOUNT_OF_PHONE_NUMBERS
		);
	});

	it('throws an Error if multiple email adresses are given', () => {
		expect(() =>
			parseVCard(
				'BEGIN:VCARD\r\nVERSION:4.0\r\nN:Doe;John;Mr.;\r\nTEL;type=WORK:+1 202 555 1212\r\nEMAIL;type=INTERNET;type=WORK;type=pref:johnDoe@example.org\r\nEMAIL;type=INTERNET;type=WORK;type=pref:johnDoe@example.org\r\nEND:VCARD\r\n'
			)
		).toThrowError(ContactsErrorMessage.CONTACTS_INVALID_AMOUNT_OF_EMAILS);
	});

	it('throws an Error if multiple addresses are given', () => {
		expect(() => parseVCard(exampleWithTwoAdresses)).toThrowError(
			ContactsErrorMessage.CONTACTS_INVALID_AMOUNT_OF_ADDRESSES
		);
	});

	it('returns the correct parsed json', () => {
		expect(parseVCard(example)).toEqual({
			firstname: 'John',
			lastname: 'Doe',
			phoneNumber: '+1 202 555 1212',
			email: 'johnDoe@example.org',
			organization: [['Example.com Inc.']],
			address: {
				poBox: '',
				extendedAddress: '',
				country: 'USA',
				locality: 'Worktown',
				postalCode: '01111',
				region: 'NY',
				streetAddress: '2 Enterprise Avenue',
			},
		});
	});

	it('parses all values correctly', () => {
		expect(parseVCard(exampleWithAllValues)).toEqual({
			firstname: 'Vorname',
			lastname: 'Nachname',
			phoneNumber: '+4915199999999',
			email: 'email@example.com',
			organization: [['Firma']],
			address: {
				poBox: 'Postfach',
				extendedAddress: 'Adresszusatz',
				country: 'Germany',
				locality: 'ORT',
				postalCode: 'PLZ',
				region: 'Region',
				streetAddress: 'Straße',
			},
		});
	});

	it('parses two organizations correctly', () => {
		expect(parseVCard(exampleWithTwoOrganizations)).toEqual({
			firstname: 'Vorname',
			lastname: 'Nachname',
			phoneNumber: '+4915199999999',
			email: 'email@example.com',
			organization: [['Firma'], ['Firma 2']],
			address: {
				poBox: 'Postfach',
				extendedAddress: 'Adresszusatz',
				country: 'Germany',
				locality: 'ORT',
				postalCode: 'PLZ',
				region: 'Region',
				streetAddress: 'Straße',
			},
		});
	});

	it('returns the correct parsed json without email', () => {
		expect(parseVCard(exampleWithoutEmail)).toEqual({
			firstname: 'John',
			lastname: 'Doe',
			phoneNumber: '+1 202 555 1212',
			email: undefined,
			organization: [['Example.com Inc.']],
			address: {
				poBox: '',
				extendedAddress: '',
				country: 'USA',
				locality: 'Worktown',
				postalCode: '01111',
				region: 'NY',
				streetAddress: '2 Enterprise Avenue',
			},
		});
	});

	it('returns a correct vCard parsed from a JSON Object', () => {
		const cards = createVCards([
			{
				addresses: [
					{
						country: 'Country',
						extendedAddress: 'Extended ADdress',
						locality: 'Locality',
						poBox: 'Post Box',
						postalCode: 'PostalCode',
						region: 'Region',
						streetAddress: 'Street',
						type: ['private'],
					},
				],
				emails: [
					{
						email: 'John.Doe@example.org',
						type: ['private', 'home'],
					},
				],
				firstname: 'John',
				lastname: 'Doe',
				organizations: [['private', 'org']],
				phoneNumbers: [
					{
						number: '+00012345678',
						type: ['work'],
					},
				],
			},
		]);
		expect(cards[0]).toBe(
			'BEGIN:VCARD\r\nVERSION:4.0\r\nN:John;Doe\r\nORG:private;org\r\nTEL;TYPE=work:+00012345678\r\nEMAIL;TYPE=private,home:John.Doe@example.org\r\nADDR;TYPE=private:Post Box;Extended\r\n  ADdress;Street;Locality;Region;PostalCode;Country\r\nEND:VCARD'
		);
	});
});

describe('Export Contacts', () => {
	let contactsModule: ContactsModule;
	let mockClient: SipgateIOClient;

	beforeEach(() => {
		mockClient = {} as SipgateIOClient;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		mockClient.get = jest.fn().mockImplementationOnce((_) => {
			return Promise.resolve({
				items: [],
				status: 200,
			});
		});
		mockClient.post = jest
			.fn()
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.mockImplementation((_, _contactsDTO: ContactsDTO) => {
				return Promise.resolve({
					status: 204,
				});
			});
		contactsModule = createContactsModule(mockClient);
	});
	it('returns a csv by using scope', async () => {
		await expect(contactsModule.exportAsCsv('PRIVATE')).resolves.not.toThrow();
	});

	it('throws no error when setting delimiter', () => {
		expect(() => contactsModule.exportAsCsv('PRIVATE', ';')).not.toThrowError();
	});

	it('throws no error when setting delimiter with shared scope', () => {
		expect(() => contactsModule.exportAsCsv('SHARED', ';')).not.toThrowError();
	});

	it('transfers the given filter and pagination parameters when exporting as csv', () => {
		contactsModule.exportAsCsv(
			'INTERNAL',
			',',
			{
				limit: 3,
				offset: 10,
			},
			{ phonenumbers: ['+490123456789'] }
		);

		expect(mockClient.get).toHaveBeenCalledWith('contacts', {
			params: {
				limit: 3,
				offset: 10,
				phonenumbers: ['+490123456789'],
			},
		});
		expect(mockClient.get).toHaveBeenCalledTimes(1);
	});

	it('transfers the given filter and pagination parameters when exporting as vCards', () => {
		contactsModule.exportAsVCards(
			'INTERNAL',
			{
				limit: 3,
				offset: 10,
			},
			{ phonenumbers: ['+490123456789'] }
		);

		expect(mockClient.get).toHaveBeenCalledWith('contacts', {
			params: {
				limit: 3,
				offset: 10,
				phonenumbers: ['+490123456789'],
			},
		});
		expect(mockClient.get).toHaveBeenCalledTimes(1);
	});

	it('transfers the given filter and pagination parameters when exporting as single vCard', () => {
		contactsModule.exportAsSingleVCard(
			'INTERNAL',
			{
				limit: 3,
				offset: 10,
			},
			{ phonenumbers: ['+490123456789'] }
		);

		expect(mockClient.get).toHaveBeenCalledWith('contacts', {
			params: {
				limit: 3,
				offset: 10,
				phonenumbers: ['+490123456789'],
			},
		});
		expect(mockClient.get).toHaveBeenCalledTimes(1);
	});

	it('transfers the given filter and pagination parameters when exporting as objects', () => {
		contactsModule.get(
			'INTERNAL',
			{
				limit: 3,
				offset: 10,
			},
			{ phonenumbers: ['+490123456789'] }
		);

		expect(mockClient.get).toHaveBeenCalledWith('contacts', {
			params: {
				limit: 3,
				offset: 10,
				phonenumbers: ['+490123456789'],
			},
		});
		expect(mockClient.get).toHaveBeenCalledTimes(1);
	});
});
