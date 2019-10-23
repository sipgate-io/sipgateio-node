export interface ClickToDial {
	deviceId?: string;
	caller: string;
	callee: string;
	callerId: string;
}

export interface InitiateNewCallSessionResponse {
	sessionId: string;
}
