// tslint:disable

import { createClient } from './lib/core/sipgateClient/sipgateClient';

const sip = createClient('user', 'pass');

sip.sms
  .send({ recipient: 'test', smsId: 'test', message: 'test' })
  .then(result => {
    console.log(result);
  })
  .catch(e => {
    console.error(e);
  });

sip.sms.list('123').then(() => {
  console.log('1');
});
