import {
	AnswerEvent,
	DataEvent,
	HangupEvent,
	NewCallEvent,
} from './models/webhook.model';

export type HandlerCallback<T> = (event: T) => string;

export interface WebhookServer {
	onNewCall: (fn: HandlerCallback<NewCallEvent>) => void;
	onAnswer: (fn: HandlerCallback<AnswerEvent>) => void;
	onHangup: (fn: HandlerCallback<HangupEvent>) => void;
	onData: (fn: HandlerCallback<DataEvent>) => void;
	stop: () => void;
}

export interface WebhookModule {
	createServer: (port: number) => Promise<WebhookServer>;
}

export enum EventType {
	NEW_CALL = 'new_call',
	ANSWER = 'answer',
	HANGUP = 'hangup',
	DATA = 'data',
}
