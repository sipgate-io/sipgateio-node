export interface RTCMModule {
	getEstablishedCalls: () => Promise<RTCMCall[]>;
	mute: (call: GenericCall, status: boolean) => Promise<void>;
	record: (call: GenericCall, recordOptions: RecordOptions) => Promise<void>;
	announce: (call: GenericCall, announcement: string) => Promise<void>;
	transfer: (
		call: GenericCall,
		transferOptions: TransferOptions
	) => Promise<void>;
	sendDTMF: (call: GenericCall, sequence: string) => Promise<void>;
	hold: (call: GenericCall, status: boolean) => Promise<void>;
	hangUp: (call: GenericCall) => Promise<void>;
}

export interface TransferOptions {
	attended: boolean;
	phoneNumber: string;
}

export interface RecordOptions {
	announcement: boolean;
	value: boolean;
}

export interface Participant {
	participantId: string;
	phoneNumber: string;
	muted: boolean;
	hold: boolean;
	owner: boolean;
}

export interface GenericCall {
	callId: string;
}

export interface RTCMCall extends GenericCall {
	muted: boolean;
	recording: boolean;
	hold: boolean;
	participants: Participant[];
}

export interface RTCMCallsResponse {
	data: RTCMCall[];
}
