import { WebhookModule, WebhookServer } from './webhook.module';
import { createWebhookModule } from './webhook';

describe('create webhook module', () => {
	let webhookModule: WebhookModule;
	const SERVER_PORT = 1234;
	const DIFFERENT_SERVER_PORT = 4321;
	const SERVER_ADDRESS = 'http://sipgate.de/';

	beforeAll(async () => {
		webhookModule = createWebhookModule();
	});

	it('should be able to start and stop a server without throwing any exception', async () => {
		let server: Promise<WebhookServer>;
		await expect(
			(server = webhookModule.createServer({
				port: SERVER_PORT,
				serverAddress: SERVER_ADDRESS,
			}))
		).resolves.not.toThrow();
		server.then(server => server.stop());
	});

	it('should expect exception when starting on same port', async () => {
		const webhookModuleTwo = createWebhookModule();
		const server = await webhookModule.createServer({
			port: SERVER_PORT,
			serverAddress: SERVER_ADDRESS,
		});
		await expect(
			webhookModuleTwo.createServer({
				port: 1234,
				serverAddress: SERVER_ADDRESS,
			})
		).rejects.toThrow();
		server.stop();
	});

	it('should start and close multiple servers on different ports without throwing an exception', async () => {
		let serverOne: Promise<WebhookServer>;
		let serverTwo: Promise<WebhookServer>;
		await expect(
			(serverOne = webhookModule.createServer({
				port: SERVER_PORT,
				serverAddress: SERVER_ADDRESS,
			}))
		).resolves.not.toThrow();
		await expect(
			(serverTwo = webhookModule.createServer({
				port: DIFFERENT_SERVER_PORT,
				serverAddress: SERVER_ADDRESS,
			}))
		).resolves.not.toThrow();
		serverOne.then(server => server.stop());
		serverTwo.then(server => server.stop());
	});

	it('should subscribe to newCallEvent without throwing an exception', async () => {
		const server = await webhookModule.createServer({
			port: SERVER_PORT,
			serverAddress: SERVER_ADDRESS,
		});
		expect(() => {
			server.onNewCall(() => {});
		}).not.toThrow();
		server.stop();
	});

	it('should subscribe to onAnswerEvent without throwing an exception', async () => {
		const server = await webhookModule.createServer({
			port: SERVER_PORT,
			serverAddress: SERVER_ADDRESS,
		});
		expect(() => {
			server.onAnswer(() => {});
		}).not.toThrow();
		server.stop();
	});

	it('should subscribe to onDataEvent without throwing an exception', async () => {
		const server = await webhookModule.createServer({
			port: SERVER_PORT,
			serverAddress: SERVER_ADDRESS,
		});
		expect(() => {
			server.onData(() => {});
		}).not.toThrow();
		server.stop();
	});

	it('should subscribe to onHangupEvent without throwing an exception', async () => {
		const server = await webhookModule.createServer({
			port: SERVER_PORT,
			serverAddress: SERVER_ADDRESS,
		});
		expect(() => {
			server.onHangup(() => {});
		}).not.toThrow();
		server.stop();
	});
});
