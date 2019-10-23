import {
	ClickToDial,
	InitiateNewCallSessionResponse
} from '../core/models/call.model';

export interface CallModule {
	initiate: (
		newCallRequest: ClickToDial
	) => Promise<InitiateNewCallSessionResponse>;
}
