import {
	AnswerEvent,
	DataEvent,
	HangupEvent,
	NewCallEvent,
} from './models/webhook.model';

export type HandlerCallback<T, U> = (event: T) => U;

export interface WebhookServer {
	onNewCall: (fn: HandlerCallback<NewCallEvent, string>) => void;
	onAnswer: (fn: HandlerCallback<AnswerEvent, void>) => void;
	onHangup: (fn: HandlerCallback<HangupEvent, void>) => void;
	onData: (fn: HandlerCallback<DataEvent, void>) => void;
	stop: () => void;
}

export interface WebhookModule {
	createServer: (port: number) => Promise<WebhookServer>;
}

export enum EventType {
	NEW_CALL = 'newCall',
	ANSWER = 'answer',
	HANGUP = 'hangup',
	DATA = 'data',
}
