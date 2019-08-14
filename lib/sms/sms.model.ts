import { Message } from '../core/models';

export interface SMSModule {
  send: (sms: Message) => Promise<string>;
}
