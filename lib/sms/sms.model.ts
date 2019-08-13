import { Message, SMSResponses } from '../core/models';

export interface SMSModule {
  list: (userId: string) => Promise<SMSResponses>;
  send: (sms: Message) => Promise<void>;
}
