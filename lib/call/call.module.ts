import { CallData, InitiateNewCallSessionResponse } from './models/call.model';

export interface CallModule {
	initiate: (
		newCallRequest: CallData
	) => Promise<InitiateNewCallSessionResponse>;
}
