import {
  ClickToDial,
  InitiateNewCallSessionResponse,
} from '../core/models/call.model';

export interface CallModule {
  initCall: (
    newCallRequest: ClickToDial,
  ) => Promise<InitiateNewCallSessionResponse>;
}
