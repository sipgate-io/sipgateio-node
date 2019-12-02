import { Fax, FaxStatus, SendFaxSessionResponse } from './models/fax.model';

export interface FaxModule {
	send: (fax: Fax) => Promise<SendFaxSessionResponse>;
	getFaxStatus: (sessionId: string) => Promise<FaxStatus>;
}
