export interface FaxModule {
	send: (fax: Fax) => Promise<SendFaxSessionResponse>;
	getFaxStatus: (sessionId: string) => Promise<FaxStatus>;
	getFaxlines(webuserId: string): Promise<Faxline[]>;
}

export interface Faxline {
	id: string;
	alias: string;
	tagline: string;
	canSend: boolean;
	canReceive: boolean;
}

interface FaxObject {
	fileContent: Buffer;
	filename?: string;
	faxlineId: string;
}

interface Recipient {
	to: string;
}

export type Fax = FaxObject & Recipient;

export interface SendFaxSessionResponse {
	sessionId: string;
}

export interface FaxDTO {
	faxlineId: string;
	recipient: string;
	filename?: string;
	base64Content: string;
}

export interface HistoryFaxResponse {
	type: 'FAX';
	faxStatusType: FaxStatus;
}

export enum FaxStatus {
	SENT = 'SENT',
	PENDING = 'PENDING',
	FAILED = 'FAILED',
	SENDING = 'SENDING',
	SCHEDULED = 'SCHEDULED',
}
