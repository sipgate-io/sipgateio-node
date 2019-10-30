import { HttpClientModule } from '../core/httpClient';
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
		const whiteList = { whitelist: ['["w0", "w1", "g3"]'] };
		expect(settingsModule.setWhitelist(whiteList) instanceof Function);
	});
	it('should contain setLog method', () => {
		expect(settingsModule.setLog(true) instanceof Function);
	});
});
