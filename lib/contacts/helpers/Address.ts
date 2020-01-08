export interface Address {
	poBox: string;
	extendedAddress: string;
	streetAddress: string;
	locality: string;
	region: string;
	postalCode: string;
	country: string;
}

export interface ContactVCard {
	firstname: string;
	lastname: string;
	phoneNumber: string;
	email?: string;
	organization: string[];
	address?: Address;
}

export interface AddressImport {
	poBox: string;
	extendedAddress: string;
	streetAddress: string;
	locality: string;
	region: string;
	postalCode: string;
	country: string;
	type: string[];
}

export interface EmailImport {
	email: string;
	type: string[];
}

export interface PhoneImport {
	number: string;
	type: string[];
}

export interface ContactImport {
	firstname: string;
	lastname: string;
	organizations: string[][];
	phoneNumbers: PhoneImport[];
	emails?: EmailImport[];
	addresses?: AddressImport[];
}
