import { ErrorMessage } from '../core/errors';
import { ExtensionType } from '../core/validator/validateExtension';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { SMSModule } from './sms.module';
import {
	ShortMessage,
	ShortMessageDTO,
	SmsCallerId,
	SmsCallerIds,
	SmsExtension,
	SmsExtensions,
} from '../core/models';
import {
	validateExtension,
	validatePhoneNumber,
	validateSendAt,
} from '../core/validator';
import handleCoreError from '../core/errors/handleCoreError';

export const createSMSModule = (client: HttpClientModule): SMSModule => ({
	async send(sms: ShortMessage, sendAt?: Date): Promise<void> {
		const smsDTO: ShortMessageDTO = { ...sms };
		const phoneNumberValidationResult = validatePhoneNumber(sms.recipient);

		const smsExtensionValidationResult = validateExtension(sms.smsId, [
			ExtensionType.SMS,
		]);

		if (!smsExtensionValidationResult.isValid) {
			throw new Error(smsExtensionValidationResult.cause);
		}

		if (!phoneNumberValidationResult.isValid) {
			throw new Error(phoneNumberValidationResult.cause);
		}
		if (sms.message === '') {
			throw new Error(ErrorMessage.SMS_INVALID_MESSAGE);
		}
		if (sendAt) {
			const sendAtValidationResult = validateSendAt(sendAt);
			if (!sendAtValidationResult.isValid) {
				throw new Error(sendAtValidationResult.cause);
			}
			smsDTO.sendAt = sendAt.getTime() / 1000;
		}

		return await client
			.post('/sessions/sms', smsDTO)
			.then(() => {})
			.catch(error => Promise.reject(handleError(error)));
	},
});

export const getUserSMSExtensions = async (
	client: HttpClientModule,
	sub: string
): Promise<SmsExtension[]> => {
	return client
		.get<SmsExtensions>(`${sub}/sms`)
		.then(value => value.data.items)
		.catch(error => Promise.reject(handleError(error)));
};

export const getSmsCallerIds = async (
	client: HttpClientModule,
	webuserExtension: string,
	smsExtension: string
): Promise<SmsCallerId[]> => {
	return client
		.get<SmsCallerIds>(`${webuserExtension}/sms/${smsExtension}/callerids`)
		.then(value => value.data.items)
		.catch(error => Promise.reject(handleError(error)));
};

export const containsPhoneNumber = (
	smsCallerIds: SmsCallerId[],
	phoneNumber: string
): boolean => {
	const foundCallerId = smsCallerIds.find(
		smsCallerId => smsCallerId.phonenumber === phoneNumber
	);

	return foundCallerId ? foundCallerId.verified : false;
};

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 403) {
		return new Error(ErrorMessage.SMS_INVALID_EXTENSION);
	}

	return handleCoreError(error);
};
