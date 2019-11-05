import { createClient } from '../../lib/core/sipgateClient';

(async () => {
	const username = process.env.SIPGATE_USERNAME || '';
	const password = process.env.SIPGATE_PASSWORD || '';

	const client = createClient(username, password);

	await client.settings.setIncomingUrl(
		'https://io.sipgate.beer/my/incoming/url2'
	);
	console.log('Incoming URL updated.');

	await client.settings.setOutgoingUrl(
		'https://io.sipgate.beer/my/outgoing/url2'
	);
	console.log('Outgoing URL updated.');

	await client.settings.setLog(true);
	console.log('Logging enabled.');

	await client.settings.setWhitelist(['p2', 'g10']);
	console.log('Whitelist updated.');
})();
