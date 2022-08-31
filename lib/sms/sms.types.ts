export interface SMSModule {
	send: (sms: ShortMessage, sendAt?: Date) => Promise<void>;
}

interface GenericShortMessage {
	message: string;
}

interface Recipient {
	to: string;
}

interface PhoneNumber {
	from: string;
}

interface DefaultWithPhoneNumber {
	smsId?: undefined;
}

type WithPhoneNumber = DefaultWithPhoneNumber & PhoneNumber;

interface WithSmsId {
	smsId: string;
	phoneNumber?: undefined;
	from?: undefined;
}

export type ShortMessage = GenericShortMessage &
	Recipient &
	(WithPhoneNumber | WithSmsId);

export interface ShortMessageDTO {
	smsId: string;
	recipient: string;
	message: string;
	sendAt?: number;
}

export interface SmsExtension {
	id: string;
	alias: string;
	callerId: string;
}

export interface SmsSenderId {
	id: number;
	phonenumber: string;
	verified: boolean;
	defaultNumber: boolean;
}
