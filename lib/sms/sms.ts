import { AuthorizationError } from '../core/errors/AuthorizationError';
import { ExtensionError } from '../core/errors/ExtensionError';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { ShortMessage } from '../core/models';
import { SMSModule } from './sms.module';

export const createSMSModule = (client: HttpClientModule): SMSModule => ({
  async send(sms: ShortMessage): Promise<void> {
    try {
      await client.post('/sessions/sms', sms);
    } catch (e) {
      const newError = handleError(e);
      return Promise.reject(newError);
    }
  },
});

// Todo handle error if the server isn't reachable
const handleError = (e: any) => {
  if (e.response.status === 401) {
    return new AuthorizationError();
  }

  if (e.response.status === 403) {
    return new ExtensionError('Invalid SMS extension');
  }

  return new Error();
};
