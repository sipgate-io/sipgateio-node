import { createClient } from '../../lib/core/sipgateClient';

(async (): Promise<void> => {
	const username = process.env.SIPGATE_USERNAME || '';
	const password = process.env.SIPGATE_PASSWORD || '';

	const client = createClient(username, password);

	await client.settings.setIncomingUrl('https://example.com/my/incoming/url2');
	console.log('Incoming URL updated.');

	await client.settings.setOutgoingUrl('https://example.com/my/outgoing/url2');
	console.log('Outgoing URL updated.');

	await client.settings.setLog(true);
	console.log('Logging enabled.');

	await client.settings.setWhitelist(['p2', 'g10']);
	console.log('Whitelist updated.');

	await client.settings.clearWhitelist();
	console.log('Whitelist cleared.');

	await client.settings.disableWhitelist();
	console.log('Whitelist disabled.');
})();
