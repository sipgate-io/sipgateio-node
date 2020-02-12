import { ShortMessage } from '../../lib/sms/models/sms.model';
import { createSMSModule } from '../../lib/sms';
import { sipgateIO } from '../../lib/core/sipgateIOClient';

const username = process.env.SIPGATE_USERNAME || '';
const password = process.env.SIPGATE_PASSWORD || '';

/**
 * For details on how to instantiate the client, see 'examples/client/client.ts'
 */
const client = sipgateIO({ username, password });

const to = process.env.SIPGATE_SMS_RECIPIENT || '';
const from = process.env.SIPGATE_SMS_FROM || '';
const smsExtension = process.env.SIPGATE_SMS_EXTENSION || '';
const message = 'This is a test message.';

const shortMessage: ShortMessage = {
	message,
	to,
	smsId: smsExtension,
};
const sms = createSMSModule(client);

sms
	.send(shortMessage)
	.then(() => {
		console.log('Sms sent.');
	})
	.catch(console.error);

const inTwoMinutes = new Date(Date.now() + 2 * 60 * 1000); // now + 2 min
sms
	.send(shortMessage, inTwoMinutes)
	.then(() => {
		console.log(`Sms scheduled for ${inTwoMinutes}`);
	})
	.catch(console.error);

sms
	.send({
		message: 'lorem',
		to,
		from,
	})
	.then(() => {
		console.log('with phone number sent');
	})
	.catch(console.error);
