export interface VoicemailsModule {
	getVoicemails(): Promise<Voicemail[]>;
}

export interface Voicemail {
	id: string;
	alias: string;
	belongsToEndpoint: {
		extension: string;
		type: string;
	};
}
