export interface ContactsModule {
	importFromCsvString: (content: string) => Promise<void>;
}

export interface ContactIndize {
	firstname: number;
	lastname: number;
	number: number;
}
