import { createSMSModule } from '../../sms/sms';
import { SMSModule } from '../../sms/sms.model';
import { createHttpClient } from '../httpClient/httpClient';

export interface SipgateClient {
  sms: SMSModule;
}

export const createClient = (
  username: string,
  password: string,
): SipgateClient => {
  const httpClient = createHttpClient(username, password);

  return {
    sms: createSMSModule(httpClient),
  };
};
