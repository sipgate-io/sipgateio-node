import { WebhookModule } from './webhook.module';
import { createWebhookModule } from './webhook';

describe('create webhook module', () => {
	let webhookModule: WebhookModule;

	beforeAll(() => {
		webhookModule = createWebhookModule();
	});

	it('should create server', async () => {
		const server = await webhookModule.createServer(1234);
		server.stop();
	});

	it('expect exception when starting on same port', async () => {
		const webhookModuleTwo = createWebhookModule();
		const server = await webhookModule.createServer(1234);
		await expect(webhookModuleTwo.createServer(1234)).rejects.toThrow();
		server.stop();
	});
});
