export interface SettingsModule {
	setIncomingUrl: (url: string) => Promise<void>;
	setOutgoingUrl: (url: string) => Promise<void>;
	setWhitelist: (extensions: string[]) => Promise<void>;
	setLog: (value: boolean) => Promise<void>;
}
