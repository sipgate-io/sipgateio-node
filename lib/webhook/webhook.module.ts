import {
	AnswerEvent,
	DataEvent,
	GatherObject,
	GatherOptions,
	HangupEvent,
	HangupObject,
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

export interface WebhookResponseInterface {
	redirectCall: (redirectOptions: RedirectOptions) => RedirectObject;
	gatherDTMF: (gatherOptions: GatherOptions) => GatherObject;
	playAudio: (playOptions: PlayOptions) => PlayObject;
	rejectCall: (rejectOptions: RejectOptions) => RejectObject;
	hangupCall: () => HangupObject;
	sendToVoicemail: () => VoicemailObject;
}

export enum RejectReason {
	BUSY = 'busy',
	REJECTED = 'rejected',
}
