import { CallModule, createCallModule } from '../../call';
import { createFaxModule, FaxModule } from '../../fax';
import { createSMSModule, SMSModule } from '../../sms';
import { createHttpClient } from '../httpClient';

export interface SipgateClient {
  sms: SMSModule;
  fax: FaxModule;
  call: CallModule;
}

export const createClient = (
  username: string,
  password: string,
): SipgateClient => {
  const httpClient = createHttpClient(username, password);

  return {
    call: createCallModule(httpClient),
    fax: createFaxModule(httpClient),
    sms: createSMSModule(httpClient),
  };
};
