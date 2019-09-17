import { createFaxModule, FaxModule } from '../../fax';
import { createSMSModule, SMSModule } from '../../sms';
import { createHttpClient } from '../httpClient';

export interface SipgateClient {
  sms: SMSModule;
  fax: FaxModule;
}

export const createClient = (
  username: string,
  password: string,
): SipgateClient => {
  const httpClient = createHttpClient(username, password);

  return {
    fax: createFaxModule(httpClient),
    sms: createSMSModule(httpClient),
  };
};
