export interface ContactsModule {
	importFromCsvString: (content: string) => Promise<void>;
}

export interface ContactIndices {
	firstname: number;
	lastname: number;
	number: number;
}
