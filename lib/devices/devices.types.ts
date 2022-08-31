export interface DevicesModule {
	getDevices: (webuserId: string) => Promise<Device[]>;
}

export type DeviceType = 'REGISTER' | 'MOBILE' | 'EXTERNAL';

export interface Device {
	id: string;
	alias: string;
	type: DeviceType;
	dnd: boolean;
	online: boolean;
	callerId?: string;
	owner?: string;
}
