import { createCallModule } from '../../lib/call';
import { sipgateIO } from '../../lib/core/sipgateIOClient';

const username = process.env.SIPGATE_USERNAME || '';
const password = process.env.SIPGATE_PASSWORD || '';
/**
 * See the example in examples/core/client.ts for how to connect to the client
 */
const client = sipgateIO({ username, password });

const from = process.env.SIPGATE_CALLER || '';
const to = process.env.SIPGATE_CALLEE || '';
const callerId = process.env.SIPGATE_CALLER_ID || '';

const call = createCallModule(client);
call
	.initiate({ to, from, callerId })
	.then(() => {
		console.log('Call initiated');
	})
	.catch(error => {
		console.error(error.message);
	});
