export interface ContactsModule {
	importFromCsvString: (csvContent: string) => Promise<void>;
	importVCardString: (vcardContent: string, scope: Scope) => Promise<void>;
	import: (contact: ContactImport, scope: Scope) => Promise<void>;
	exportAsCsv: (scope: ExportScope) => Promise<string>;
	exportAsVCards: (scope: ExportScope) => Promise<string[]>;
	exportAsSingleVCard: (scope: ExportScope) => Promise<string>;
}

interface ContactImport {
	firstname: string;
	lastname: string;
	address?: Address;
	phone?: PhoneNumber;
	email?: Email;
	organization?: string[];
}

interface Email {
	email: string;
	type: string[];
}

interface PhoneNumber {
	number: string;
	type: string[];
}

interface Address {
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
	addresses: Address[];
	organization: string[][];
	scope: Scope;
}

type Scope = 'PRIVATE' | 'SHARED';

type ExportScope = Scope | 'INTERNAL';

interface ContactRequest {
	id: string;
	name: string;
	picture: string;
	emails: { email: string; type: string[] }[];
	numbers: { number: string; type: string[] }[];
	addresses: Address[];
	organization: string[][];
	scope: Scope;
}

export interface ContactsRequest {
	items: ContactRequest[];
	totalCount: number;
}
