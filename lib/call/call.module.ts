import { InitiateNewCallSessionResponse } from '../core/models/call.model';

export interface CallModule {
  initCall: (
    extensionId: string,
    calleeNumber: string,
    callerId: string,
  ) => Promise<InitiateNewCallSessionResponse>;
}
