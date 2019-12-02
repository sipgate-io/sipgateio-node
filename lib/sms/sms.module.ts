import { ShortMessage } from './models/sms.model';

export interface SMSModule {
	send: (sms: ShortMessage, sendAt?: Date) => Promise<void>;
}
