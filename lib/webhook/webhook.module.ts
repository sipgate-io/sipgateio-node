export type HandlerCallback = () => string;

export interface WebhookServer {
	on: (eventType: EventType, fn: HandlerCallback) => void;
}

export interface WebhookModule {
	createServer: (port: number) => WebhookServer;
	handlers: Map<EventType, HandlerCallback>;
}

export enum EventType {
	'NEW_CALL',
	'ON_ANSWER',
	'ON_HANGUP',
	'ON_DATA',
	'UNUSED',
}
