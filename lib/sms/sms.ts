import { AuthorizationError } from '../core/errors/AuthorizationError';
import { UnprocessableEntity } from '../core/errors/UnprocessableEntity';
import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { Message } from '../core/models';
import { SMSModule } from './sms.model';

export const createSMSModule = (client: HttpClientModule): SMSModule => ({
  async send(sms: Message): Promise<string> {
    try {
      const { data } = await client.post('/sessions/sms', sms);
      return data;
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
    return new UnprocessableEntity('Wrong SMS extension');
  }

  return new Error('boom');
};
