export interface ContactsModule {
	importFromCsvString: (content: string) => Promise<void>;
}
