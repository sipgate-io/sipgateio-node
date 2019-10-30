import { createClient } from '../../lib/core/sipgateClient';

const username = process.env.SIPGATE_USERNAME || '';
const password = process.env.SIPGATE_PASSWORD || '';

const client = createClient(username, password);

client.settings
	.setIncomingUrl('https://io.sipgate.beer/my/incoming/url')
	.then(result => {
		console.log('Incoming URL updated.', { result });
	})
	.catch(error => {
		throw error;
	});
