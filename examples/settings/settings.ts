import { createClient } from '../../lib/core/sipgateClient';

const username = process.env.SIPGATE_USERNAME || '';
const password = process.env.SIPGATE_PASSWORD || '';

const client = createClient(username, password);

client.settings
	.getSettings()
	.then(result => {
		console.log('Config fetched.', result);
	})
	.catch(error => {
		console.error(error);
	});
