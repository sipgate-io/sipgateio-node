import { CallData, InitiateNewCallSessionResponse } from '../core/models';

export interface CallModule {
	initiate: (
		newCallRequest: CallData
	) => Promise<InitiateNewCallSessionResponse>;
}
