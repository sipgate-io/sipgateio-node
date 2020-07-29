import { Address } from '../contacts.types';
import { Email, PhoneNumber } from './../contacts.types';

export interface ContactVCard {
	firstname: string;
	lastname: string;
	phoneNumber: string;
	email?: string;
	organization: string[];
	address?: Address;
}

export interface AddressImport extends Address {
	type: string[];
}

export interface ContactImport {
	firstname: string;
	lastname: string;
	organizations: string[][];
	phoneNumbers: PhoneNumber[];
	emails?: Email[];
	addresses?: AddressImport[];
}
