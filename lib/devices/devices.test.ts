import { Device } from './devices.types';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { createDevicesModule } from './devices';

describe('getDevices', () => {
	const mockuserId = 'w0';
	const mockClient: SipgateIOClient = {} as SipgateIOClient;

	it('extracts the `items` from the API response', async () => {
		const testDevices: Device[] = [
			{
				id: 'e53',
				alias: 'VoIP-Service-Phones',
				type: 'REGISTER',
				online: false,
				dnd: false,
				activePhonelines: [],
				activeGroups: [],
			},
			{
				id: 'e14',
				alias: 'VoIP-Central-Phone',
				type: 'REGISTER',
				online: false,
				dnd: false,
				activePhonelines: [],
				activeGroups: [],
			},
		];

		mockClient.get = jest
			.fn()
			.mockImplementationOnce(() => Promise.resolve({ items: testDevices }));

		const devicesModule = createDevicesModule(mockClient);

		const faxlines = await devicesModule.getDevices(mockuserId);
		expect(faxlines).toEqual(testDevices);

		expect(mockClient.get).toHaveBeenCalledWith(`${mockuserId}/devices`);
	});
});
