import { createHttpClient } from '..';
import { createFaxModule } from '../../fax';
import { FaxModule } from '../../fax/fax.module';
import { createSMSModule } from '../../sms';
import { SMSModule } from '../../sms/sms.module';

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
