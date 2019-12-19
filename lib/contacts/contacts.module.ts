export interface ContactsModule {
	importFromCsvString: (csvContent: string) => Promise<void>;
	importVCardString: (
		vcardContent: string,
		scope: 'PRIVATE' | 'SHARED'
	) => Promise<void>;
}

interface Email {
	email: string;
	type: string[];
}

interface PhoneNumber {
	number: string;
	type: string[];
}

interface Adress {
	poBox: string;
	extendedAddress: string;
	streetAddress: string;
	locality: string;
	region: string;
	postalCode: string;
	country: string;
}

export interface ContactsDTO {
	name: string;
	family: string;
	given: string;
	picture: null;
	emails: Email[];
	numbers: PhoneNumber[];
	addresses: Adress[];
	organization: string[][];
	scope: string;
}
