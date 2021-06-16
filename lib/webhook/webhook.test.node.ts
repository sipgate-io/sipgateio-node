import { WebhookModule, WebhookServer } from './webhook.types';
import { WebhookResponse, createWebhookModule } from './webhook';
import axios, { AxiosResponse } from 'axios';
import qs from 'qs';

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
		server.then((server) => server.stop());
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
		serverOne.then((server) => server.stop());
		serverTwo.then((server) => server.stop());
	});

	it('should subscribe to newCallEvent without throwing an exception', async () => {
		const server = await webhookModule.createServer({
			port: SERVER_PORT,
			serverAddress: SERVER_ADDRESS,
		});
		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
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
			// eslint-disable-next-line @typescript-eslint/no-empty-function
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
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			server.onData(() => {});
		}).not.toThrow();
		server.stop();
	});

	it('should subscribe to onHangUpEvent without throwing an exception', async () => {
		const server = await webhookModule.createServer({
			port: SERVER_PORT,
			serverAddress: SERVER_ADDRESS,
		});
		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			server.onHangUp(() => {});
		}).not.toThrow();
		server.stop();
	});
});

describe('create webhook-"Response" module', () => {
	it('should return a gather object without play tag', () => {
		const gatherOptions = { maxDigits: 1, timeout: 2000 };
		const gatherObject = {
			Gather: { _attributes: { maxDigits: '1', timeout: '2000' } },
		};
		const result = WebhookResponse.gatherDTMF(gatherOptions);
		expect(result).toEqual(gatherObject);
	});

	it('should return a gather object with play tag', () => {
		const testUrl = 'www.testurl.de';
		const gatherOptions = {
			announcement: testUrl,
			maxDigits: 1,
			timeout: 2000,
		};
		const gatherObject = {
			Gather: {
				_attributes: { maxDigits: '1', timeout: '2000' },
				Play: { Url: testUrl },
			},
		};
		const result = WebhookResponse.gatherDTMF(gatherOptions);
		expect(result).toEqual(gatherObject);
	});
});

describe('The webhook server', () => {
	const webhookModule = createWebhookModule();
	let webhookServer: WebhookServer;

	const port = 9999;
	const serverAddress = `localhost:9999`;

	const newCallWebhook = {
		callId: '',
		direction: 'in',
		event: 'newCall',
		from: '4912354678',
		'fullUserId[]': ['123456789'],
		originalCallId: '',
		to: '49999999',
		'user[]': ['TestUser'],
		'userId[]': ['123456789'],
		xcid: '',
	};

	const anonymousNewCallEvent = {
		callId: '',
		direction: 'in',
		event: 'newCall',
		from: 'anonymous',
		'fullUserId[]': ['123456789'],
		originalCallId: '',
		to: 'anonymous',
		'user[]': ['TestUser'],
		'userId[]': ['123456789'],
		xcid: '',
	};

	const signature = 'hlY7r9Vad0NP/7xJxf+vcDqjWaGWHOcIrj+rcP5aqQQcHtbSLsElp2kRNRPBL5unWbq6bExVPZB49HHM+Y/fWSVL19q7KSJhYPHfikcME0r0mCYB4S/VnJwnIvpiqz6s7Dpnk3wDCy65B3WQLwBVWA9oh6ojNM/g+87YnoMTKRx1KoFqosKNfBp1c1I8XjXusGOW/VlGnMb6wHhUVdwi9K7FfUgxj2pnV+M1Xv9rYs6RAi4V1OcUPqdT5geHsxWa09sk+AEHSUm1EFnAvx7PhIkugpNwST7yPKHf0+iyei4qUQCBZtfQVOI4mLZTRfQuyVo3YuJfvHaNPYY34/1ZCZGCKeu+HS6WHs1vGUyKxSi8v4JJqog2VOlWruf8pMGg+syuAFwuxiCnWsSXgaaUfe9JrBAFjBxUmNP9DzR1bbkwxkJnthacu7jALXjGsubjSSSl955QgenV/ZpODHgWDPg0fe6qGILtk+kXLjyfSsoR/qgzE5W5OAyZq8W64h01KAt9Q283N7/2nogy6keiIWL3qjPolWnrchSP7iJUatM2YiTcpkNKnJ70UE05cdw3swuNe7zqD51MdOX3rAioEOFgOIFMSrxMVX+V4XK7sa5o43smN8lHoa+0AogQMuIrC7k2axdRbulSSNfyqVAZIT4qS0cItiv3aPXsdDKkkA0=';

	const sendTestWebhook = async (
		newCallEvent = newCallWebhook
	): Promise<AxiosResponse<string>> => {
		return await axios.post(
			`http://${serverAddress}`,
			qs.stringify(newCallEvent),
			{
				headers: { 'Content-Type': 'application/x-www-form-urlencoded',
				'x-sipgate-signature': signature},
			}
		);
	};

	beforeEach(async () => {
		webhookServer = await webhookModule.createServer({
			port,
			serverAddress,
		});
	});

	afterEach(() => {
		webhookServer.stop();
	});

	it('should prepend a "+" to the from and to fields', async () => {
		webhookServer.onNewCall((newCallEvent) => {
			expect(newCallEvent.to).toEqual(`+${newCallWebhook.to}`);
			expect(newCallEvent.from).toEqual(`+${newCallWebhook.from}`);
		});

		await sendTestWebhook();
	});

	it('should not prepend a "+" to the from and to fields if they are anonymous', async () => {
		webhookServer.onNewCall((newCallEvent) => {
			expect(newCallEvent.to).toEqual(anonymousNewCallEvent.to);
			expect(newCallEvent.from).toEqual(anonymousNewCallEvent.from);
		});

		await sendTestWebhook(anonymousNewCallEvent);
	});

	it('should parse the response and replace the array key with plural keys', async () => {
		webhookServer.onNewCall((newCallEvent) => {
			expect(newCallEvent.users).toEqual(newCallWebhook['user[]']);
			expect(newCallEvent.userIds).toEqual(newCallWebhook['userId[]']);
			expect(newCallEvent.fullUserIds).toEqual(newCallWebhook['fullUserId[]']);
		});

		await sendTestWebhook();
	});

	it('should generate a valid XML response with no handlers for answer or hangup event', async () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		webhookServer.onNewCall(() => {});

		const response = await sendTestWebhook();

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="utf-8"?>\n<Response/>`
		);
	});

	it('should generate a valid XML response with onAnswer URL', async () => {
		webhookServer.onAnswer(() => null);

		const response = await sendTestWebhook();

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="utf-8"?>\n<Response onAnswer="${serverAddress}"/>`
		);
	});

	it('should generate a valid XML response with onHangup URL', async () => {
		webhookServer.onHangUp(() => null);

		const response = await sendTestWebhook();

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="utf-8"?>\n<Response onHangup="${serverAddress}"/>`
		);
	});

	it('should generate a valid XML response with onAnswer and onHangup URL', async () => {
		webhookServer.onAnswer(() => null);
		webhookServer.onHangUp(() => null);

		const response = await sendTestWebhook();

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="utf-8"?>\n<Response onAnswer="${serverAddress}" onHangup="${serverAddress}"/>`
		);
	});
});