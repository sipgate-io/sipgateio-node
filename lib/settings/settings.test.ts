import { ErrorMessage } from '../core/errors';
import { HttpClientModule } from '../core/httpClient';
import { Settings } from '../core/models';
import { SettingsModule } from './settings.module';
import { createSettingsModule } from './settings';

describe('get settings', () => {
	let mockedSettingsModule: SettingsModule;
	let mockClient: HttpClientModule;

	beforeAll(() => {
		mockClient = {} as HttpClientModule;
		mockedSettingsModule = createSettingsModule(mockClient);
	});

	it('should use the endpoint "settings/sipgateio"', async () => {
		mockClient.get = jest.fn().mockImplementationOnce(() => {
			return Promise.resolve({
				data: {
					incomingUrl: 'string',
					outgoingUrl: 'string',
					log: true,
					whitelist: []
				},
				status: 200
			});
		});

		await mockedSettingsModule.setIncomingUrl('https://test.de');

		expect(mockClient.get).toBeCalledWith('settings/sipgateio');
	});
});

describe('setIncomingUrl', () => {
	let mockClient: HttpClientModule;

	const TEST_INCOMING_URL = 'http://newIncoming.url';

	beforeAll(() => {
		mockClient = {} as HttpClientModule;
	});

	it('should set supplied incomingUrl in fetched settings object', async () => {
		const settingsModule = createSettingsModule(mockClient);

		const settings: Settings = {
			incomingUrl: '',
			log: false,
			outgoingUrl: '',
			whitelist: []
		};

		const expectedSettings = { ...settings };
		expectedSettings.incomingUrl = TEST_INCOMING_URL;

		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.resolve({ status: 200, data: settings })
			);

		mockClient.put = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({ status: 200, data: {} }));

		await settingsModule.setIncomingUrl(TEST_INCOMING_URL);

		await expect(mockClient.put).toBeCalledWith(
			expect.anything(),
			expectedSettings
		);
	});

	it('should throw an error when supplied with an invalid url', async () => {
		const settingsModule = createSettingsModule(mockClient);

		await expect(settingsModule.setIncomingUrl('newUrl')).rejects.toThrowError(
			new Error(ErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL)
		);
	});
});

describe('setOutgoingUrl', () => {
	let mockClient: HttpClientModule;

	const TEST_OUTGOING_URL = 'http://newOutgoing.url';

	beforeAll(() => {
		mockClient = {} as HttpClientModule;
	});

	it('should set supplied incomingUrl in fetched settings object', async () => {
		const settingsModule = createSettingsModule(mockClient);

		const settings: Settings = {
			incomingUrl: '',
			log: false,
			outgoingUrl: '',
			whitelist: []
		};

		const expectedSettings = { ...settings };
		expectedSettings.outgoingUrl = TEST_OUTGOING_URL;

		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() =>
				Promise.resolve({ status: 200, data: settings })
			);

		mockClient.put = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({ status: 200, data: {} }));

		await settingsModule.setOutgoingUrl(TEST_OUTGOING_URL);

		await expect(mockClient.put).toBeCalledWith(
			expect.anything(),
			expectedSettings
		);
	});

	it('should throw an error when supplied with an invalid url', async () => {
		const settingsModule = createSettingsModule(mockClient);

		await expect(settingsModule.setOutgoingUrl('newUrl')).rejects.toThrowError(
			new Error(ErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL)
		);
	});
});
