import { PagedResponse, Pagination } from '../core';

export interface ContactsModule {
	create: (contact: ContactImport, scope: Scope) => Promise<void>;
	update: (contact: ContactUpdate) => Promise<void>;
	deleteAllPrivate: () => Promise<void>;
	deleteAllShared: () => Promise<void>;
	delete: (id: string) => Promise<void>;
	importFromCsvString: (csvContent: string) => Promise<void>;
	importVCardString: (vcardContent: string, scope: Scope) => Promise<void>;
	paginatedExportAsCsv: (
		scope: ExportScope,
		delimiter?: string,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<PagedResponse<string>>;
	/**
	 * @deprecated You should prefer to use `paginatedExportAsCSV`
	 */
	exportAsCsv: (
		scope: ExportScope,
		delimiter?: string,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string>;
	paginatedExportAsVCards: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<PagedResponse<string[]>>;
	paginatedExportAsJSON: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<PagedResponse<string>>;
	/**
	 * @deprecated You should prefer to use `paginatedExportAsJSON`
	 */
	exportAsJSON: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string>;
	/**
	 * @deprecated You should prefer to use `paginatedExportAsVCards`
	 */
	exportAsVCards: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string[]>;
	paginatedExportAsSingleVCard: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<PagedResponse<string>>;
	/**
	 * @deprecated You should prefer to use `paginatedExportAsSingleVCard`
	 */
	exportAsSingleVCard: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<string>;
	paginatedGet: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<PagedResponse<ContactResponse[]>>;
	/**
	 * @deprecated You should prefer to use `paginatedGet`
	 */
	get: (
		scope: ExportScope,
		pagination?: Pagination,
		filter?: ContactsExportFilter
	) => Promise<ContactResponse[]>;
}

export interface ContactImport {
	firstname: string;
	lastname: string;
	address?: Address;
	phone?: PhoneNumber;
	email?: Email;
	picture?: string;
	organization?: string[][];
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
	picture: string | null;
	emails: Email[];
	numbers: PhoneNumber[];
	addresses: Address[];
	organization: string[][];
	scope: Scope;
}

export type Scope = 'PRIVATE' | 'SHARED';

type ExportScope = Scope | 'INTERNAL' | 'ALL';

export type ContactUpdate = ContactResponse;

export interface ContactResponse {
	id: string;
	name: string;
	picture: string | null;
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
