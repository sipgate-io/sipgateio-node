import { ConnectionError } from '../core/errors/ConnectionError';
import { ExtensionError } from '../core/errors/ExtensionError';
import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { ShortMessage, SmsExtension, SmsExtensions } from '../core/models';
import { validatePhoneNumber } from '../core/validator';
import { SMSModule } from './sms.module';

export const createSMSModule = (client: HttpClientModule): SMSModule => ({
  async send(sms: ShortMessage): Promise<void> {
    validatePhoneNumber(sms.recipient);

    try {
      await client.post('/sessions/sms', sms);
    } catch (e) {
      const newError = handleError(e);
      return Promise.reject(newError);
    }
  },
  async schedule(sms: ShortMessage, sendAt: Date): Promise<void> {
    sms.sendAt = sendAt.getTime();
    return this.send(sms);
  },
});

export const getUserSMSExtensions = async (
  client: HttpClientModule,
  sub: string,
): Promise<SmsExtension[]> => {
  try {
    const { data } = await client.get<SmsExtensions>(`${sub}/sms`);

    return data.items;
  } catch (e) {
    const newError = handleError(e);
    return Promise.reject(newError);
  }
};

const handleError = (e: any) => {
  if (
    e.message === 'Network Error' ||
    e.message.includes('getaddrinfo ENOTFOUND')
  ) {
    return new ConnectionError();
  }
  if (e.response.status === 403) {
    return new ExtensionError('Invalid SMS extension');
  }

  return handleCoreError(e.message);
};
