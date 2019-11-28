import { sipgateIO } from '../../lib/core/sipgateIOClient';

(async (): Promise<void> => {
	const username = process.env.SIPGATE_USERNAME || '';
	const password = process.env.SIPGATE_PASSWORD || '';

	/**
	 * See the example in examples/core/client.ts for how to connect to the client
	 */
	const client = sipgateIO({ username, password });

	await client.webhookSettings.setIncomingUrl(
		'https://example.com/my/incoming/url2'
	);
	console.log('Incoming URL updated.');

	await client.webhookSettings.setOutgoingUrl(
		'https://example.com/my/outgoing/url2'
	);
	console.log('Outgoing URL updated.');

	await client.webhookSettings.setLog(true);
	console.log('Logging enabled.');

	await client.webhookSettings.setWhitelist(['p2', 'g10']);
	console.log('Whitelist updated.');

	await client.webhookSettings.clearWhitelist();
	console.log('Whitelist cleared.');

	await client.webhookSettings.disableWhitelist();
	console.log('Whitelist disabled.');
})();
