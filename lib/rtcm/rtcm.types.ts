export interface RTCMModule {
	getEstablishedCalls: () => Promise<RTCMCall[]>;
	mute: (call: RTCMCall, status: boolean) => Promise<void>;
	record: (call: RTCMCall, recordOptions: RecordOptions) => Promise<void>;
	announce: (call: RTCMCall, announcement: string) => Promise<void>;
	transfer: (call: RTCMCall, transferOptions: TransferOptions) => Promise<void>;
	sendDTMF: (call: RTCMCall, sequence: string) => Promise<void>;
	hold: (call: RTCMCall, status: boolean) => Promise<void>;
	hangUp: (call: RTCMCall) => Promise<void>;
}

export interface TransferOptions {
	attended: boolean;
	phoneNumber: string;
}

export interface RecordOptions {
	announcement: boolean;
	value: boolean;
}

/**
 * Call Type def
 */

export interface Participant {
	participantId: string;
	phoneNumber: string;
	muted: boolean;
	hold: boolean;
	owner: boolean;
}

export interface RTCMCall {
	callId: string;
	muted: boolean;
	recording: boolean;
	hold: boolean;
	participants: Participant[];
}

export interface RTCMCallsResponse {
	data: RTCMCall[];
}
