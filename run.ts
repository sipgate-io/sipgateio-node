import { EventType, createWebhookModule } from './lib/webhook';

const webhookModule = createWebhookModule();

const webhooks = webhookModule.createServer(1234);

webhooks.on(EventType.ON_ANSWER, () => {
	return '<bla></bla>';
});
