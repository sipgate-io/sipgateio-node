import {
	AnswerEvent,
	DataEvent,
	GatherObject,
	GatherOptions,
	HangUpEvent,
	HangUpObject,
	NewCallEvent,
	PlayObject,
	PlayOptions,
	RedirectObject,
	RedirectOptions,
	RejectObject,
	RejectOptions,
	ResponseObject,
	VoicemailObject,
} from './models/webhook.model';

export type HandlerCallback<T, U> = (event: T) => U;

export interface WebhookServer {
	onNewCall: (fn: HandlerCallback<NewCallEvent, ResponseObject | void>) => void;
	onAnswer: (fn: HandlerCallback<AnswerEvent, void>) => void;
	onHangUp: (fn: HandlerCallback<HangUpEvent, void>) => void;
	onData: (fn: HandlerCallback<DataEvent, ResponseObject | void>) => void;
	stop: () => void;
}

export interface ServerOptions {
	port: number;
	serverAddress: string;
	hostname?: string;
}

export interface WebhookModule {
	createServer: (serverOptions: ServerOptions) => Promise<WebhookServer>;
}

export enum EventType {
	NEW_CALL = 'newCall',
	ANSWER = 'answer',
	HANGUP = 'hangup',
	DATA = 'dtmf',
}

export interface WebhookResponseInterface {
	redirectCall: (redirectOptions: RedirectOptions) => RedirectObject;
	gatherDTMF: (gatherOptions: GatherOptions) => GatherObject;
	playAudio: (playOptions: PlayOptions) => PlayObject;
	rejectCall: (rejectOptions: RejectOptions) => RejectObject;
	hangUpCall: () => HangUpObject;
	sendToVoicemail: () => VoicemailObject;
}

export enum RejectReason {
	BUSY = 'busy',
	REJECTED = 'rejected',
}
