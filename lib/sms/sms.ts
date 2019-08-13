import { HttpClientModule } from '../core/httpClient/httpClient.module';
import { Message, SMSResponses } from '../core/models';
import { SMSModule } from './sms.model';

export const createSMSModule = (client: HttpClientModule): SMSModule => ({
  sms: {
    async list(userId: string): Promise<SMSResponses> {
      const { data } = await client.get(`/${userId}/sms`);
      return data;
    },
    async send(sms: Message): Promise<void> {
      const { data } = await client.post('/sessions/sms', sms);
      return data;
    },
  },
});
