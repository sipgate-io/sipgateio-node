export interface Address {
	streetAddress?: string;
	locality?: string;
	region?: string;
	postalCode?: string;
	country?: string;
}
export interface ContactVCard {
	firstname: string;
	lastname: string;
	phoneNumber: string;
	email?: string;
	address: Address;
}
