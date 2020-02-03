export interface GenericShortMessage {
	message: string;
}

export interface DefaultRecipient {
	to: string;
}

export interface DefaultPhoneNumber {
	from: string;
}

/**
 * @deprecated
 * @since 1.0.1
 * use @interface Recipient instead
 */
export interface DeprecatedRecipient {
	recipient: string;
}
/**
 * @deprecated
 * @since 1.0.1
 * use @interface  instead
 */
export interface DeprecatedPhoneNumber {
	phoneNumber: string;
}

type Recipient = DefaultRecipient | DeprecatedRecipient;
type PhoneNumber = DeprecatedPhoneNumber | DefaultPhoneNumber;

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
