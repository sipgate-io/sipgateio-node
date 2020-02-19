import { EventType } from '../webhook.module';

enum Direction {
	IN = 'in',
	OUT = 'out',
}

enum HangupCause {
	NORMAL_CLEARING = 'normalClearing',
	BUSY = 'busy',
	CANCEL = 'cancel',
	NO_ANSWER = 'noAnswer',
	CONGESTION = 'congestion',
	NOT_FOUND = 'notFound',
	FORWARDED = 'forwarded',
}

export interface Event {
	event: EventType;
	callId: string;
}

export interface GenericCallEvent extends Event {
	direction: Direction;
	from: string;
	to: string;
	xcid: string;
}

export interface NewCallEvent extends GenericCallEvent {
	event: EventType.NEW_CALL;
	originalCallId: string;
	user: string[];
	userId: string[];
	fullUserId: string[];
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

export interface HangupEvent extends GenericCallEvent {
	event: EventType.HANGUP;
	cause: HangupCause;
	answeringNumber: string;
}

export type CallEvent = NewCallEvent | AnswerEvent | HangupEvent | DataEvent;
