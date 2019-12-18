export interface ContactsModule {
	importFromCsvString: (csvContent: string) => Promise<void>;
	importVCardString: (vcardContent: string) => Promise<void>;
}
