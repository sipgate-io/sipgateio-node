import { Fax, FaxStatusType, SendFaxSessionResponse } from '../core/models';

export interface FaxModule {
	send: (fax: Fax) => Promise<SendFaxSessionResponse>;
	getFaxStatus: (sessionId: string) => Promise<FaxStatusType>;
}
