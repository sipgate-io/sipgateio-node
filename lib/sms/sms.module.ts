import { ShortMessage } from '../core/models';

export interface SMSModule {
  send: (sms: ShortMessage) => Promise<void>;
  schedule: (sms: ShortMessage, sendAt: Date) => Promise<void>;
}
