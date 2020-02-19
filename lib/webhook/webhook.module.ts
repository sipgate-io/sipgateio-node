import { CallEvent } from './models/webhook.model';

export type HandlerCallback = (callData: CallEvent) => string;

export interface WebhookServer {
	on: (eventType: EventType, fn: HandlerCallback) => void;
}

export interface WebhookModule {
	createServer: (port: number) => Promise<WebhookServer>;
}

export enum EventType {
	NEW_CALL = 'new_call',
	ANSWER = 'answer',
	HANGUP = 'hangup',
	DATA = 'data',
	UNUSED = 'unused',
}
