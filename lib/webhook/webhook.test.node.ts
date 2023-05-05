import { WebhookModule, WebhookServer } from './webhook.types';
import {
	WebhookResponse,
	createWebhookModule,
	serverAddressesMatch,
} from './webhook';
import axios, { AxiosResponse } from 'axios';
import qs from 'qs';

import * as audioUtils from './audioUtils';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { WebhookErrorMessage } from './webhook.errors';

const mockedGetAudioMetadata = jest.spyOn(audioUtils, 'getAudioMetadata');

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

	it('should subscribe to onHangUpEvent without throwing an exception', async () => {
		const server = await webhookModule.createServer({
			port: SERVER_PORT,
			serverAddress: SERVER_ADDRESS,
		});
		expect(() => {
			server.onHangUp(() => {});
		}).not.toThrow();
		server.stop();
	});
});

describe('create webhook-"Response" module', () => {
	let mockClient: SipgateIOClient;

	beforeEach(() => {
		mockClient = {} as SipgateIOClient;
		jest.useFakeTimers();
		jest.spyOn(global, 'setTimeout');
	});

	it('should return a gather object without play tag', async () => {
		const gatherOptions = { maxDigits: 1, timeout: 2000 };
		const gatherObject = {
			Gather: { _attributes: { maxDigits: '1', timeout: '2000' } },
		};
		const result = await WebhookResponse.gatherDTMF(gatherOptions);
		expect(result).toEqual(gatherObject);
	});

	it('should return a gather object with play tag and a valid audio file', async () => {
		mockedGetAudioMetadata.mockReturnValue(
			new Promise((resolve) =>
				resolve({
					container: 'WAVE',
					codec: 'PCM',
					bitsPerSample: 16,
					sampleRate: 8000,
					numberOfChannels: 1,
				})
			)
		);

		const testUrl = 'www.testurl.com';
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
		const result = await WebhookResponse.gatherDTMF(gatherOptions);
		expect(result).toEqual(gatherObject);
	});

	it('should throw an exception for invalid max digits in gather dtmf', async () => {
		const gatherOptions = {
			maxDigits: 0,
			timeout: 2000,
		};
		try {
			await WebhookResponse.gatherDTMF(gatherOptions);
			fail('It should throw "Invalid DTMF maxDigits"');
		} catch (e) {
			expect(e instanceof Error);
			if (e instanceof Error) {
				expect(e.message).toContain('Invalid DTMF maxDigits');
			}
		}
	});

	it('should throw an exception for invalid timeout in gather dtmf', async () => {
		const gatherOptions = {
			maxDigits: 6,
			timeout: -1,
		};
		try {
			await WebhookResponse.gatherDTMF(gatherOptions);
			fail('It should throw "Invalid DTMF timeout"');
		} catch (e) {
			expect(e instanceof Error);
			if (e instanceof Error) {
				expect(e.message).toContain('Invalid DTMF timeout');
			}
		}
	});

	it('should throw an exception for an invalid audio file in gather dtmf', async () => {
		mockedGetAudioMetadata.mockReturnValue(
			new Promise((resolve) =>
				resolve({
					container: 'WAVE',
					codec: 'PCM',
					bitsPerSample: 16,
					sampleRate: 44100,
					numberOfChannels: 1,
				})
			)
		);

		const testUrl = 'www.testurl.com';
		const gatherOptions = {
			announcement: testUrl,
			maxDigits: 1,
			timeout: 2000,
		};

		try {
			await WebhookResponse.gatherDTMF(gatherOptions);
			fail('It should throw "Invalid audio format"');
		} catch (e) {
			expect(e instanceof Error);
			if (e instanceof Error) {
				expect(e.message).toContain('Invalid audio format');
			}
		}
	});

	it('should return a play audio object for a valid audio file', async () => {
		mockedGetAudioMetadata.mockReturnValue(
			new Promise((resolve) =>
				resolve({
					container: 'WAVE',
					codec: 'PCM',
					bitsPerSample: 16,
					sampleRate: 8000,
					numberOfChannels: 1,
				})
			)
		);
		const testUrl = 'www.testurl.com';

		const playOptions = {
			announcement: testUrl,
		};
		const result = await WebhookResponse.playAudio(playOptions);
		const playObject = { Play: { Url: 'www.testurl.com' } };
		expect(result).toEqual(playObject);
	});

	it('should return a play audio object for a valid audio file with hangUp and timeOut', async () => {
		const duration = 7140;
		const timeout = 1000;

		mockedGetAudioMetadata.mockReturnValue(
			new Promise((resolve) =>
				resolve({
					container: 'WAVE',
					codec: 'PCM',
					bitsPerSample: 16,
					sampleRate: 8000,
					numberOfChannels: 1,
					duration: duration / 1000,
				})
			)
		);

		mockClient.delete = jest.fn().mockImplementation(() => Promise.resolve());

		const testUrl = 'www.testurl.com';
		const callId = '1234567890';

		const playOptions = {
			announcement: testUrl,
		};
		const result = await WebhookResponse.playAudioAndHangUp(
			playOptions,
			mockClient,
			callId,
			timeout
		);
		const playObject = { Play: { Url: testUrl } };

		expect(result).toEqual(playObject);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(
			expect.any(Function),
			duration + timeout
		);
		jest.runAllTimers();
		expect(mockClient.delete).toHaveBeenCalledTimes(1);
		expect(mockClient.delete).toHaveBeenCalledWith(`/calls/${callId}`);
	});

	it('should return a play audio object for a valid audio file with hangUp and without timeOut', async () => {
		const duration = 7140;
		const timeout = 0;

		mockedGetAudioMetadata.mockReturnValue(
			new Promise((resolve) =>
				resolve({
					container: 'WAVE',
					codec: 'PCM',
					bitsPerSample: 16,
					sampleRate: 8000,
					numberOfChannels: 1,
					duration: duration / 1000,
				})
			)
		);

		mockClient.delete = jest.fn().mockImplementation(() => Promise.resolve());

		const testUrl = 'www.testurl.com';
		const callId = '1234567890';

		const playOptions = {
			announcement: testUrl,
		};
		const result = await WebhookResponse.playAudioAndHangUp(
			playOptions,
			mockClient,
			callId
		);
		const playObject = { Play: { Url: testUrl } };

		expect(result).toEqual(playObject);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(
			expect.any(Function),
			duration + timeout
		);
		jest.runAllTimers();
		expect(mockClient.delete).toHaveBeenCalledTimes(1);
		expect(mockClient.delete).toHaveBeenCalledWith(`/calls/${callId}`);
	});

	it('should throw an exception for an invalid audio file in play audio', async () => {
		mockedGetAudioMetadata.mockReturnValue(
			new Promise((resolve) =>
				resolve({
					container: 'WAVE',
					codec: 'PCM',
					bitsPerSample: 16,
					sampleRate: 44100,
					numberOfChannels: 1,
				})
			)
		);
		const testUrl = 'www.testurl.com';

		const playOptions = {
			announcement: testUrl,
		};

		try {
			await WebhookResponse.playAudio(playOptions);
			fail('It should throw "Invalid audio format"');
		} catch (e) {
			expect(e instanceof Error);
			if (e instanceof Error) {
				expect(e.message).toContain('Invalid audio format');
			}
		}
	});
});

describe('Signed webhook server', () => {
	const webhookModule = createWebhookModule();
	let webhookServer: WebhookServer;

	const port = 9999;
	const serverAddress = `http://localhost:9999`;

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

	const newCallWebhookModified = {
		callId: '',
		direction: 'in',
		event: 'newCall',
		from: '4912354678',
		'fullUserId[]': ['123456779'],
		originalCallId: '',
		to: '49999999',
		'user[]': ['TestUser'],
		'userId[]': ['123456789'],
		xcid: '',
	};

	const signature =
		'hlY7r9Vad0NP/7xJxf+vcDqjWaGWHOcIrj+rcP5aqQQcHtbSLsElp2kRNRPBL5unWbq6bExVPZB49HHM+Y/fWSVL19q7KSJhYPHfikcME0r0mCYB4S/VnJwnIvpiqz6s7Dpnk3wDCy65B3WQLwBVWA9oh6ojNM/g+87YnoMTKRx1KoFqosKNfBp1c1I8XjXusGOW/VlGnMb6wHhUVdwi9K7FfUgxj2pnV+M1Xv9rYs6RAi4V1OcUPqdT5geHsxWa09sk+AEHSUm1EFnAvx7PhIkugpNwST7yPKHf0+iyei4qUQCBZtfQVOI4mLZTRfQuyVo3YuJfvHaNPYY34/1ZCZGCKeu+HS6WHs1vGUyKxSi8v4JJqog2VOlWruf8pMGg+syuAFwuxiCnWsSXgaaUfe9JrBAFjBxUmNP9DzR1bbkwxkJnthacu7jALXjGsubjSSSl955QgenV/ZpODHgWDPg0fe6qGILtk+kXLjyfSsoR/qgzE5W5OAyZq8W64h01KAt9Q283N7/2nogy6keiIWL3qjPolWnrchSP7iJUatM2YiTcpkNKnJ70UE05cdw3swuNe7zqD51MdOX3rAioEOFgOIFMSrxMVX+V4XK7sa5o43smN8lHoa+0AogQMuIrC7k2axdRbulSSNfyqVAZIT4qS0cItiv3aPXsdDKkkA0=';

	const sendTestWebhook = async (
		signature: string,
		verificationIpAddress: string,
		newCallEvent = newCallWebhook
	): Promise<AxiosResponse<string>> => {
		return await axios.post(serverAddress, qs.stringify(newCallEvent), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'x-sipgate-signature': signature,
				'x-forwarded-for': verificationIpAddress,
				host: 'localhost',
			},
		});
	};

	// disable console.error to not fill up the jest output
	let consoleSpy: jest.SpyInstance;
	beforeAll(() => {
		consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});
	afterAll(() => {
		consoleSpy.mockRestore();
	});

	beforeEach(async () => {
		webhookServer = await webhookModule.createServer({
			port,
			serverAddress,
		});
	});

	afterEach(() => {
		webhookServer.stop();
	});

	it('should successfully verify header signature and sipgate ip address for webhook body', async () => {
		webhookServer.onNewCall(() => {});

		const response = await sendTestWebhook(signature, '217.116.118.254');

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="utf-8"?>\n<Response/>`
		);
	});

	it('should successfully verify header signature and sipgate ip address for webhook body', async () => {
		webhookServer.onNewCall(() => {});

		const response = await sendTestWebhook(signature, '212.9.46.32');

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="utf-8"?>\n<Response/>`
		);
	});

	it('should return error if header signature is not valid', async () => {
		webhookServer.onNewCall(() => {});

		const response = await sendTestWebhook('fakeSignature', '217.116.118.254');

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="UTF-8"?><Error message="Signature verification failed." />`
		);
	});

	it('should return error if body is not valid for signature', async () => {
		webhookServer.onNewCall(() => {});

		const response = await sendTestWebhook(
			signature,
			'217.116.118.254',
			newCallWebhookModified
		);

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="UTF-8"?><Error message="Signature verification failed." />`
		);
	});

	it('should return error if header ip address is not from sipgate', async () => {
		webhookServer.onNewCall(() => {});

		const response = await sendTestWebhook(signature, '127.0.0.1');

		expect(response.data).toEqual(
			`<?xml version="1.0" encoding="UTF-8"?><Error message="${WebhookErrorMessage.INVALID_ORIGIN}" />`
		);
	});
});

describe('The webhook server', () => {
	const webhookModule = createWebhookModule();
	let webhookServer: WebhookServer;

	const port = 9999;
	const serverAddress = `http://localhost:9999`;

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

	const sendTestWebhook = async (
		newCallEvent = newCallWebhook
	): Promise<AxiosResponse<string>> => {
		return await axios.post(serverAddress, qs.stringify(newCallEvent), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				host: 'localhost',
			},
		});
	};

	beforeEach(async () => {
		webhookServer = await webhookModule.createServer({
			port,
			serverAddress,
			skipSignatureVerification: true,
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

describe('serverAddressesMatch', () => {
	it('should pass if hosts are equal but protocol is given', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/' },
				{ serverAddress: 'https://sipgate.dev/' }
			)
		).toBeTruthy();
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/foo/' },
				{ serverAddress: 'https://sipgate.dev/foo/' }
			)
		).toBeTruthy();
	});

	it('should pass if hosts are equal but no trailing / is given', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/' },
				{ serverAddress: 'https://sipgate.dev' }
			)
		).toBeTruthy();
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/foo' },
				{ serverAddress: 'https://sipgate.dev/foo' }
			)
		).toBeTruthy();
	});

	it('should fail if hosts are not equal', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'not-sipgate.dev' }, url: '/' },
				{ serverAddress: 'https://sipgate.dev' }
			)
		).toBeFalsy();
	});

	it('should fail if same path is given', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/one' },
				{ serverAddress: 'https://sipgate.dev/one' }
			)
		).toBeTruthy();
	});

	it('should fail if different path is given', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/one' },
				{ serverAddress: 'https://sipgate.dev/two' }
			)
		).toBeFalsy();
	});

	it('should pass if serverAddress is not encrypted', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/' },
				{ serverAddress: 'http://sipgate.dev/' }
			)
		).toBeTruthy();
	});

	it('should pass if other port HTTP is used', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/' },
				{ serverAddress: 'http://sipgate.dev:8080/' }
			)
		).toBeTruthy();
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/foo/' },
				{ serverAddress: 'http://sipgate.dev:8080/foo/' }
			)
		).toBeTruthy();
	});

	it('should pass with the same query parameters', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/?customer=123&action=foo' },
				{ serverAddress: 'http://sipgate.dev:8080/?customer=123&action=foo' }
			)
		).toBeTruthy();
	});

	it('should fail with different query parameters', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/?customer=123&action=bar' },
				{ serverAddress: 'http://sipgate.dev:8080/?customer=123&action=foo' }
			)
		).toBeFalsy();
	});

	it('should fail with query parameters in different order', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/?customer=123&action=bar' },
				{ serverAddress: 'http://sipgate.dev:8080/?action=bar&customer=123' }
			)
		).toBeFalsy();
	});

	it('should fail with missing query parameters', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/?customer=123' },
				{ serverAddress: 'http://sipgate.dev:8080/?customer=123&action=foo' }
			)
		).toBeFalsy();
	});

	it('should fail with too many query parameters', () => {
		expect(
			serverAddressesMatch(
				{ headers: { host: 'sipgate.dev' }, url: '/?customer=123&action=foo' },
				{ serverAddress: 'http://sipgate.dev:8080/?customer=123' }
			)
		).toBeFalsy();
	});
});
