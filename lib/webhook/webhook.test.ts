import { WebhookModule } from './webhook.module';
import { createWebhookModule } from './webhook';

describe('get settings', () => {
	let webhookModule: WebhookModule;

	beforeAll(() => {
		webhookModule = createWebhookModule();
	});

	it('should use the endpoint "settings/sipgateio"', async () => {
		webhookModule.createServer(1234);
		const { server } = webhookModule;
		expect(server).toBeDefined();
		if (server !== undefined) {
			server.close();
		}
	});
});
