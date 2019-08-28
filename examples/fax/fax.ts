// tslint:disable no-console
import { Fax } from '../../lib/core/models';
import { createClient } from '../../lib/core/sipgateClient';

const username = process.env.SIPGATE_USERNAME || '';
const password = process.env.SIPGATE_PASSWORD || '';

const client = createClient(username, password);

const fax: Fax = {
  filename: './testpage.pdf',
  recipient: process.env.SIPGATE_FAX_RECIPIENT || '',
};

client.fax
  .send(fax)
  .then(() => {
    console.log('Fax sent');
  })
  .catch(error => {
    console.error(error.message);
  });
