export interface SettingsModule {
	setIncomingUrl: (url: string) => Promise<void>;
}
