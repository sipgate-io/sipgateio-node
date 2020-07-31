export interface FaxModule {
	send: (fax: Fax) => Promise<SendFaxSessionResponse>;
	getFaxStatus: (sessionId: string) => Promise<FaxStatus>;
}

interface FaxObject {
	fileContent: Buffer;
	filename?: string;
	faxlineId: string;
}

interface Recipient {
	to: string;
}

/**
 * @deprecated
 * @since 1.0.1
 * use @interface Recipient instead
 */
interface DeprecatedRecipient {
	recipient: string;
}

type Recipients = Recipient | DeprecatedRecipient;

export type Fax = FaxObject & Recipients;

// DTOs

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
