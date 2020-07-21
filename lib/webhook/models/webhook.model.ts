import { EventType, RejectReason } from '../webhook.module';

enum Direction {
	IN = 'in',
	OUT = 'out',
}

enum HangUpCause {
	NORMAL_CLEARING = 'normalClearing',
	BUSY = 'busy',
	CANCEL = 'cancel',
	NO_ANSWER = 'noAnswer',
	CONGESTION = 'congestion',
	NOT_FOUND = 'notFound',
	FORWARDED = 'forwarded',
}

interface Event {
	event: EventType;
	callId: string;
	originalCallId: string;
}

interface GenericCallEvent extends Event {
	direction: Direction;
	from: string;
	to: string;
	xcid: string;
}

export interface NewCallEvent extends GenericCallEvent {
	event: EventType.NEW_CALL;
	'user[]': string[];
	'userId[]': string[];
	'fullUserId[]': string[];
}

export interface AnswerEvent extends GenericCallEvent {
	event: EventType.ANSWER;
	user: string;
	userId: string;
	fullUserId: string;
	answeringNumber: string;
	diversion?: string;
}

export interface DataEvent extends Event {
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
