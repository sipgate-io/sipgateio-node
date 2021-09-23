import { Server } from 'http';

export enum EventType {
	NEW_CALL = 'newCall',
	ANSWER = 'answer',
	HANGUP = 'hangup',
	DATA = 'dtmf',
}

export type HandlerCallback<T extends GenericEvent, U> = (event: T) => U;

export type NewCallCallback = HandlerCallback<
	NewCallEvent,
	ResponseObject | Promise<ResponseObject> | void
>;
export type AnswerCallback = HandlerCallback<AnswerEvent, void>;
export type HangUpCallback = HandlerCallback<HangUpEvent, void>;
export type DataCallback = HandlerCallback<
	DataEvent,
	ResponseObject | Promise<ResponseObject> | void
>;

export interface WebhookHandlers {
	[EventType.NEW_CALL]?: NewCallCallback;
	[EventType.ANSWER]?: AnswerCallback;
	[EventType.HANGUP]?: HangUpCallback;
	[EventType.DATA]?: DataCallback;
}
export interface WebhookServer {
	onNewCall: (fn: NewCallCallback) => void;
	onAnswer: (fn: AnswerCallback) => void;
	onHangUp: (fn: HangUpCallback) => void;
	onData: (fn: DataCallback) => void;
	stop: () => void;
	getHttpServer: () => Server;
}

export interface ServerOptions {
	port: number | string;
	serverAddress: string;
	hostname?: string;
	skipSignatureVerification?: boolean;
}

export interface WebhookModule {
	createServer: (serverOptions: ServerOptions) => Promise<WebhookServer>;
}

export interface WebhookResponseInterface {
	redirectCall: (redirectOptions: RedirectOptions) => RedirectObject;
	gatherDTMF: (gatherOptions: GatherOptions) => Promise<GatherObject>;
	playAudio: (playOptions: PlayOptions) => Promise<PlayObject>;
	rejectCall: (rejectOptions: RejectOptions) => RejectObject;
	hangUpCall: () => HangUpObject;
	sendToVoicemail: () => VoicemailObject;
}

export enum RejectReason {
	BUSY = 'busy',
	REJECTED = 'rejected',
}

export enum WebhookDirection {
	IN = 'in',
	OUT = 'out',
}

export enum HangUpCause {
	NORMAL_CLEARING = 'normalClearing',
	BUSY = 'busy',
	CANCEL = 'cancel',
	NO_ANSWER = 'noAnswer',
	CONGESTION = 'congestion',
	NOT_FOUND = 'notFound',
	FORWARDED = 'forwarded',
}

export interface GenericEvent {
	event: EventType;
	callId: string;
	originalCallId: string;
}

interface GenericCallEvent extends GenericEvent {
	direction: WebhookDirection;
	from: string;
	to: string;
	xcid: string;
}

export interface NewCallEvent extends GenericCallEvent {
	event: EventType.NEW_CALL;
	originalCallId: string;
	users: string[];
	userIds: string[];
	fullUserIds: string[];
}

export interface AnswerEvent extends GenericCallEvent {
	event: EventType.ANSWER;
	answeringNumber: string;
	user?: string;
	userId?: string;
	fullUserId?: string;
	diversion?: string;
}

export interface DataEvent extends GenericEvent {
	event: EventType.DATA;
	dtmf: string; // Can begin with zero, so it has to be a string
}

export interface HangUpEvent extends GenericCallEvent {
	event: EventType.HANGUP;
	cause: HangUpCause;
	answeringNumber: string;
}

export type CallEvent = NewCallEvent | AnswerEvent | HangUpEvent | DataEvent;

export type RedirectOptions = {
	numbers: string[];
	anonymous?: boolean;
	callerId?: string;
};

export type GatherOptions = {
	announcement?: string;
	maxDigits: number;
	timeout: number;
};

export type PlayOptions = {
	announcement: string;
};

export type RejectOptions = {
	reason: RejectReason;
};

export type RedirectObject = {
	Dial: {
		_attributes: { callerId?: string; anonymous?: string };
		Number: string[];
	};
};

export type GatherObject = {
	Gather: {
		_attributes: { onData?: string; maxDigits?: string; timeout?: string };
		Play?: { Url: string };
	};
};

export type PlayObject = {
	Play: { Url: string };
};

export type RejectObject = {
	Reject: { _attributes: { reason?: string } };
};

export type HangUpObject = {
	Hangup: {};
};

export type VoicemailObject = {
	Dial: { Voicemail: {} };
};

export type ResponseObject =
	| RedirectObject
	| VoicemailObject
	| PlayObject
	| GatherObject
	| HangUpObject
	| RejectObject;
