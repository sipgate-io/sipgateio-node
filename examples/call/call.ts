// tslint:disable no-console
import { createClient } from '../../lib/core/sipgateClient';

const password = process.env.SIPGATE_PASSWORD || '';
const username = process.env.SIPGATE_USERNAME || '';

const client = createClient(username, password);

const caller = process.env.SIPGATE_CALLER || '';
const callee = process.env.SIPGATE_CALLEE || '';
const callerId = process.env.SIPGATE_CALLER_ID || '';

client.call
  .initiate({ callee, caller, callerId })
  .then(() => {
    console.log('Call initiated');
  })
  .catch(error => {
    console.error(error.message);
  });
