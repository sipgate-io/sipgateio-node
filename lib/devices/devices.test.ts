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
				activePhonelines: [
					{
						id: 'p61',
						alias: 'Call Service Test',
					},
				],
				activeGroups: [],
				credentials: {
					username: '2705977e53',
					password: '5UdYe4779GdM',
					sipServer: 'sipgate.de',
					outboundProxy: 'sipgate.de',
					sipServerWebsocketUrl: 'wss://sip.sipgate.de',
				},
				registered: [],
				emergencyAddressId: '1128909',
				addressUrl: 'https://api.sipgate.com/v2/addresses/1128909',
			},
			{
				id: 'e14',
				alias: 'VoIP-Central-Phone',
				type: 'REGISTER',
				online: false,
				dnd: false,
				activePhonelines: [
					{
						id: 'p0',
						alias: 'Peterle Drobusch-Lukfgx',
					},
				],
				activeGroups: [],
				credentials: {
					username: '2705977e14',
					password: 'qpU1o76cbDat',
					sipServer: 'sipgate.de',
					outboundProxy: 'sipgate.de',
					sipServerWebsocketUrl: 'wss://sip.sipgate.de',
				},
				registered: [],
				emergencyAddressId: '1128909',
				addressUrl: 'https://api.sipgate.com/v2/addresses/1128909',
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
