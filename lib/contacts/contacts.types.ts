import { Pagination } from '../core';

export interface ContactsModule {
	import: (contact: ContactImport, scope: Scope) => Promise<void>;
	importFromCsvString: (csvContent: string) => Promise<void>;
	importVCardString: (vcardContent: string, scope: Scope) => Promise<void>;
	exportAsCsv: (
		scope: ExportScope,
		delimiter?: string,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string>;
	exportAsVCards: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string[]>;
	exportAsSingleVCard: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string>;
	exportAsObjects: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<ContactResponse[]>;
}

interface ContactImport {
	firstname: string;
	lastname: string;
	address?: Address;
	phone?: PhoneNumber;
	email?: Email;
	organization?: string[];
}

export interface Email {
	email: string;
	type: string[];
}

export interface PhoneNumber {
	number: string;
	type: string[];
}

export interface Address {
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

export interface ContactResponse {
	id: string;
	name: string;
	picture: string;
	emails: Email[];
	numbers: PhoneNumber[];
	addresses: Address[];
	organization: string[][];
	scope: Scope;
}

export interface ContactsListResponse {
	items: ContactResponse[];
	totalCount: number;
}

export interface ContactsExportFilter {
	phonenumbers: string[];
}

export interface ImportCSVRequestDTO {
	base64Content: string;
}
