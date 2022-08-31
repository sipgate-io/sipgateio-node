import { Device, DevicesModule } from './devices.types';
import { SipgateIOClient } from '../core';

export const createDevicesModule = (
	client: SipgateIOClient
): DevicesModule => ({
	getDevices: (webuserId): Promise<Device[]> => {
		return client
			.get<{ items: Device[] }>(`${webuserId}/devices`)
			.then((response) => response.items);
	},
});
