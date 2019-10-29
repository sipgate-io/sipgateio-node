import { HttpClientModule } from '../core/httpClient';
import { createSettingsModule } from './settings';

describe('Settings Module', () => {
	const mockClient = {} as HttpClientModule;
	const settingsModule = createSettingsModule(mockClient);
	it('should exist on client object', () => {
		expect(settingsModule instanceof Function);
	});

	it('should contain getSettings method', () => {
		expect(settingsModule.getSettings() instanceof Function);
	});
});

describe('getSettings Method', () => {
	const mockClient = {} as HttpClientModule;
	const settingsModule = createSettingsModule(mockClient);
	it('should send a GET request to settings/sipgateio', () => {
		settingsModule.getSettings();
	});
});
