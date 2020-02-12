import { createSettingsModule } from '../../lib/webhook-settings';
import { sipgateIO } from '../../lib/core/sipgateIOClient';

(async (): Promise<void> => {
	const username = process.env.SIPGATE_USERNAME || '';
	const password = process.env.SIPGATE_PASSWORD || '';

	/**
	 * For details on how to instantiate the client, see 'examples/client/client.ts'
	 */
	const client = sipgateIO({ username, password });
	const webhookSettings = createSettingsModule(client);

	await webhookSettings.setIncomingUrl('https://example.com/my/incoming/url2');
	console.log('Incoming URL updated.');

	await webhookSettings.setOutgoingUrl('https://example.com/my/outgoing/url2');
	console.log('Outgoing URL updated.');

	await webhookSettings.setLog(true);
	console.log('Logging enabled.');

	await webhookSettings.setWhitelist(['p2', 'g10']);
	console.log('Whitelist updated.');

	await webhookSettings.clearWhitelist();
	console.log('Whitelist cleared.');

	await webhookSettings.disableWhitelist();
	console.log('Whitelist disabled.');
})();
