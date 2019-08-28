// tslint:disable no-console
import { ShortMessage } from '../../lib/core/models';
import { createClient } from '../../lib/core/sipgateClient';

const username = process.env.SIPGATE_USERNAME || '';
const password = process.env.SIPGATE_PASSWORD || '';

const client = createClient(username, password);

const recipient = process.env.SIPGATE_SMS_RECIPIENT || '';
const smsExtension = process.env.SIPGATE_SMS_EXTENSION || '';
const message = 'This is a test message';

const sms: ShortMessage = {
  message,
  recipient,
  smsId: smsExtension,
};

client.sms
  .send(sms)
  .then(() => {
    console.log('Sms sent.');
  })
  .catch(error => {
    console.error(error.message);
  });
