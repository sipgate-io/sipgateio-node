export interface DevicesModule {
	getDevices: (webuserId: string) => Promise<Device[]>;
}

export type DeviceType = 'REGISTER' | 'MOBILE' | 'EXTERNAL';

export interface ActiveRouting {
	id: string;
	alias: string;
}

export interface Device {
	id: string;
	alias: string;
	type: DeviceType;
	dnd: boolean;
	online: boolean;
	callerId?: string;
	owner?: string;
	activePhonelines?: ActiveRouting[];
	activeGroups?: ActiveRouting[];
}
