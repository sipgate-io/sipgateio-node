import { WebhookModule } from './webhook.module';
import { createWebhookModule } from './webhook';

describe('create webhook module', () => {
	let webhookModule: WebhookModule;

	beforeAll(() => {
		webhookModule = createWebhookModule();
	});

	afterEach(() => {
		if (webhookModule.server !== undefined) {
			webhookModule.server.close();
		}
	});

	it('should create server', () => {
		webhookModule.createServer(1234);
		const { server } = webhookModule;
		expect(server).toBeDefined();
	});

	it('expect exception when starting on same port', async () => {
		const webhookModuleTwo = createWebhookModule();
		await webhookModule.createServer(1234);
		await expect(webhookModuleTwo.createServer(1234)).rejects.toThrow();
	});
});
