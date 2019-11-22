export interface ContactsModule {
	importFromCsvString: (csvContent: string) => Promise<void>;
}
