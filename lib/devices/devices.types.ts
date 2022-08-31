export interface DevicesModule {
	getDevices: (webuserId: string) => Promise<Device[]>;
}

// taken from https://github.sipgate.net/sipgate/web-apps/blob/main/packages/app-web/src/api/types/devices.ts
interface ApiLegacyBaseDevice {
	id: string;
	alias: string;
	type: ApiDeviceType;
	online: boolean;
	dnd: boolean;
	activePhonelines: { id: string; alias: string }[];
	activeGroups: { id: string; alias: string }[];
}

interface ApiLegacyMobileDevice extends ApiLegacyBaseDevice {
	type: 'MOBILE';
	esim: boolean;
	simCredentials: {
		simId: string;
		puk1: string;
		puk2: string;
	};
}

interface ApiLegacyRegisterDevice extends ApiLegacyBaseDevice {
	type: 'REGISTER';
	credentials: {
		username: string;
		password: string;
		sipServer: string;
		outboundProxy: string;
		sipServerWebsocketUrl: string;
	};
	emergencyAddressId: string;
	// incomingCallDisplayState: 'CALLED_NUMBER' | 'CALLER_NUMBER';
	addressUrl: string;
}

interface ApiLegacyExternalDevice extends ApiLegacyBaseDevice {
	type: 'EXTERNAL';
	number: string;
}

export type ApiLegacyDevice =
	| ApiLegacyMobileDevice
	| ApiLegacyRegisterDevice
	| ApiLegacyExternalDevice;

export type ApiDeviceType = 'REGISTER' | 'MOBILE' | 'EXTERNAL';

export type ApiSimIntendedUse = 'VOICE' | 'DATA';

export enum ApiSimState {
	INACTIVE = 'INACTIVE',
	PENDING = 'PENDING',
	ACTIVE = 'ACTIVE',
}

export type ApiSim = {
	id: string;
	alias: string;
	state: ApiSimState;
	esim: boolean;
	simId: string;
	puk1: string;
	puk2: string;
	intendedUse: ApiSimIntendedUse;
};

export interface ApiBaseDevice {
	id: string;
	alias: string;
	type: ApiDeviceType;
	dnd: boolean;
	online: boolean;
	callerId: string;
	activePhonelines: string[];
	activeGroups: string[];
	owner: string;
}

export interface ApiExternalDevice extends ApiBaseDevice {
	type: 'EXTERNAL';
	number: string;
	incomingCallDisplayState: 'CALLED_NUMBER' | 'CALLER_NUMBER';
}

export interface ApiMobileDevice extends ApiBaseDevice {
	type: 'MOBILE';
	sims: ApiSim[];
	pendingSim?: { iccid: string };
	smsReceivingSim?: string;
	callRecording: boolean;
}

export interface ApiRegisteredDevice {
	userAgent: string;
	ip: string;
	port: string;
}

export interface ApiRegisterDevice extends ApiBaseDevice {
	type: 'REGISTER';
	sipCredentials: {
		username: string;
		password: string;
		sipServer: string;
		outboundProxy: string;
		sipServerWebsocketUrl: string;
	};
	registered: ApiRegisteredDevice[];
	emergencyAddressId: string;
	singleRowDisplay: boolean;
	tariffAnnouncement: boolean;
	callRecording: boolean;
	addressUrl: string;
}

export type ApiDevice = ApiExternalDevice | ApiMobileDevice | ApiRegisterDevice;

export type Device = ApiDevice | ApiLegacyDevice;
