import { HttpClientModule } from '../core/httpClient';
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
