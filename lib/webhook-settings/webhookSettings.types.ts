export interface WebhookSettingsModule {
	setIncomingUrl: (url: string) => Promise<void>;
	setOutgoingUrl: (url: string) => Promise<void>;
	setWhitelist: (extensions: string[]) => Promise<void>;
	setLog: (value: boolean) => Promise<void>;
	clearIncomingUrl: () => Promise<void>;
	clearOutgoingUrl: () => Promise<void>;
	clearWhitelist: () => Promise<void>;
	disableWhitelist: () => Promise<void>;
	getWebhookSettings: () => Promise<WebhookSettings>;
}

export interface WebhookSettings {
	incomingUrl: string;
	outgoingUrl: string;
	log: boolean;
	whitelist: string[] | null;
}
