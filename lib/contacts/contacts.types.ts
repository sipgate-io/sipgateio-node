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
	) => Promise<ContactRequest[]>;
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

export interface ContactRequest {
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

export interface ContactsExportFilter {
	phonenumbers: string[];
}

export interface ImportCSVRequestDTO {
	base64Content: string;
}
