import { ShortMessage } from '../../lib/sms/models/sms.model';
import { sipgateIO } from '../../lib/core/sipgateIOClient';

const username = process.env.SIPGATE_USERNAME || '';
const password = process.env.SIPGATE_PASSWORD || '';

/**
 * See the example in examples/core/client.ts for how to connect to the client
 */
const client = sipgateIO({ username, password });

const recipient = process.env.SIPGATE_SMS_RECIPIENT || '';
const from = process.env.SIPGATE_SMS_FROM || '';
const smsExtension = process.env.SIPGATE_SMS_EXTENSION || '';
const message = 'This is a test message.';

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
	.catch(console.error);

const inTwoMinutes = new Date(Date.now() + 2 * 60 * 1000); // now + 2 min
client.sms
	.send(sms, inTwoMinutes)
	.then(() => {
		console.log(`Sms scheduled for ${inTwoMinutes}`);
	})
	.catch(console.error);

client.sms
	.send({
		message: 'lorem',
		recipient: recipient,
		phoneNumber: from,
	})
	.then(() => {
		console.log('with phone number sent');
	})
	.catch(console.error);
