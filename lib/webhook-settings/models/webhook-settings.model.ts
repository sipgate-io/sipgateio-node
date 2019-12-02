export interface WebhookSettings {
	incomingUrl: string;
	outgoingUrl: string;
	log: boolean;
	whitelist: string[] | null;
}
