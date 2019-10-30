import { HttpClientModule } from '../core/httpClient';
import { SettingsModule } from './settings.module';
import { createSettingsModule } from './settings';

describe('Settings Module', () => {
	const mockClient = {} as HttpClientModule;
	const settingsModule = createSettingsModule(mockClient);
	it('should exist on client object', () => {
		expect(settingsModule instanceof Function);
	});

	it('should contain setIncomingUrl method', () => {
		expect(
			settingsModule.setIncomingUrl('https://myURL.de') instanceof Function
		);
	});

	it('should contain setOutgoingUrl method', () => {
		expect(
			settingsModule.setOutgoingUrl('https://myURL.de') instanceof Function
		);
	});
	it('should contain setWhitelist method', () => {
		const whiteList = ['extension1', 'extension2', 'extension3'];
		expect(settingsModule.setWhitelist(whiteList) instanceof Function);
	});

	it('should contain setLog method', () => {
		expect(settingsModule.setLog(true) instanceof Function);
	});
});

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
