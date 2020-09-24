interface BaseCallData {
	deviceId?: string;
	callerId?: string;
}

interface Callee {
	to: string;
}

interface Caller {
	from: string;
}

export type CallData = BaseCallData & Callee & Caller;

export interface InitiateNewCallSessionResponse {
	sessionId: string;
}

export interface CallModule {
	initiate: (
		newCallRequest: CallData
	) => Promise<InitiateNewCallSessionResponse>;
}

export interface CallDTO {
	caller: string;
	callee: string;
	callerId?: string;
	deviceId?: string;
}
