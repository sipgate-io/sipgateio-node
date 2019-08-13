import { Message, SMSResponses } from '../core/models';

export interface SMSModule {
  sms: {
    list: (userId: string) => Promise<SMSResponses>;
    send: (sms: Message) => Promise<void>;
  };
}
