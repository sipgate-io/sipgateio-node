export interface GenericShortMessage {
	smsId?: string;
	to: string;
	message: string;
	phoneNumber?: string;
}

interface WithPhoneNumber {
	smsId?: undefined;
	phoneNumber: string;
}

interface WithSmsId {
	smsId: string;
	phoneNumber?: undefined;
}

export type ShortMessage = GenericShortMessage & (WithPhoneNumber | WithSmsId);

export interface ShortMessageDTO {
	smsId: string;
	to: string;
	message: string;
	sendAt?: number;
}

export interface SmsExtension {
	id: string;
	alias: string;
	callerId: string;
}

export interface SmsExtensions {
	items: SmsExtension[];
}

export interface SmsSenderId {
	id: number;
	phonenumber: string;
	verified: boolean;
	defaultNumber: boolean;
}

export interface SmsCallerIds {
	items: SmsSenderId[];
}
