import {
	AnswerEvent,
	DataEvent,
	HangupEvent,
	NewCallEvent,
} from './models/webhook.model';
import { ResponseObject } from './models/webhookResponse.model';

export type HandlerCallback<T, U> = (event: T) => U;

export interface WebhookServer {
	onNewCall: (fn: HandlerCallback<NewCallEvent, ResponseObject | void>) => void;
	onAnswer: (fn: HandlerCallback<AnswerEvent, void>) => void;
	onHangup: (fn: HandlerCallback<HangupEvent, void>) => void;
	onData: (fn: HandlerCallback<DataEvent, void>) => void;
	stop: () => void;
}

export interface ServerSettings {
	port: number;
	serverAddress: string;
	hostname?: string;
}

export interface WebhookModule {
	createServer: (serverSettings: ServerSettings) => Promise<WebhookServer>;
}

export enum EventType {
	NEW_CALL = 'newCall',
	ANSWER = 'answer',
	HANGUP = 'hangup',
	DATA = 'dtmf',
}
