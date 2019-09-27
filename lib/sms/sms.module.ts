import { ShortMessage } from '../core/models';

export interface SMSModule {
  send: (sms: ShortMessage, sendAt?: Date) => Promise<void>;
}
