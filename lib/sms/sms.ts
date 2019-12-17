import { ErrorMessage } from './errors/ErrorMessage';
import { ExtensionType } from '../fax/validators';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { SMSModule } from './sms.module';
import {
	ShortMessage,
	ShortMessageDTO,
	SmsSenderId,
	SmsCallerIds,
	SmsExtensions,
} from './models/sms.model';
import { getAuthenticatedWebuser } from '../core/helpers/authorizationInfo';
import {
	validateExtension,
	validatePhoneNumber,
	validateSendAt,
} from '../fax/validators';
import handleCoreError from '../core/errors/handleError';

export const createSMSModule = (client: HttpClientModule): SMSModule => ({
	async send(sms: ShortMessage, sendAt?: Date): Promise<void> {
		if (sendAt) {
			const sendAtValidationResult = validateSendAt(sendAt);
			if (!sendAtValidationResult.isValid) {
				throw new Error(sendAtValidationResult.cause);
			}
		}

		let smsDTO: ShortMessageDTO = {
			smsId: 's0',
			message: sms.message,
			recipient: sms.recipient,
		};

		const webuserId = await getAuthenticatedWebuser(client);

		const smsExtension = await getUserSmsExtension(client, webuserId);

		const senderIds = await getSmsCallerIds(
			client,
			webuserId,
			smsExtension
		);

		const senderId = senderIds.find(
			value => value.phonenumber === sms.phoneNumber
		);
		if (senderId === undefined) {
		  throw new Error(ErrorMessage.SMS_NUMBER_NOT_REGISTERED)
    }
		if (!senderId.verified) {
		  throw new Error(ErrorMessage.SMS_NUMBER_NOT_VERIFIED)
    }

		const defaultSmsId = senderIds.find(value => value.defaultNumber);
		if (defaultSmsId === undefined) {
			throw new Error(ErrorMessage.SMS_NO_DEFAULT_SENDER_ID);
		}

		if (sms.phoneNumber !== undefined) {
			await setDefaultSenderId(
				client,
				webuserId,
				smsExtension,
				senderId
			);

			if (sendAt !== undefined) {
				smsDTO = {
					smsId: 's0',
					message: sms.message,
					recipient: sms.recipient,
					sendAt: sendAt.getTime() / 1000,
				};
			} else {
				smsDTO = {
					smsId: 's0',
					message: sms.message,
					recipient: sms.recipient,
				};
			}
		}
		if (sms.smsId !== undefined) {
			const smsExtensionValidationResult = validateExtension(sms.smsId, [
				ExtensionType.SMS,
			]);
			if (!smsExtensionValidationResult.isValid) {
				throw new Error(smsExtensionValidationResult.cause);
			}
			if (sendAt !== undefined) {
				smsDTO = {
					smsId: sms.smsId,
					message: sms.message,
					recipient: sms.recipient,
					sendAt: sendAt.getTime() / 1000,
				};
			} else {
				smsDTO = {
					smsId: sms.smsId,
					message: sms.message,
					recipient: sms.recipient,
				};
			}
		}

		const phoneNumberValidationResult = validatePhoneNumber(sms.recipient);

		if (!phoneNumberValidationResult.isValid) {
			throw new Error(phoneNumberValidationResult.cause);
		}
		if (sms.message === '') {
			throw new Error(ErrorMessage.SMS_INVALID_MESSAGE);
		}

		return await client
			.post('/sessions/sms', smsDTO)
			.then(async () => {
				if (sms.phoneNumber !== undefined) {
					await setDefaultSenderId(
						client,
						webuserId,
						smsExtension,
						defaultSmsId
					);
				}
			})
			.catch(error => {
				return Promise.reject(handleError(error));
			});
	},
});

export const getUserSmsExtension = async (
	client: HttpClientModule,
	webuserId: string
): Promise<string> => {
	return client
		.get<SmsExtensions>(`${webuserId}/sms`)
		.then(value => value.data.items[0].id)
		.catch(error => Promise.reject(handleError(error)));
};

export const getSmsCallerIds = async (
	client: HttpClientModule,
	webuserExtension: string,
	smsExtension: string
): Promise<SmsSenderId[]> => {
	return client
		.get<SmsCallerIds>(`${webuserExtension}/sms/${smsExtension}/callerids`)
		.then(value => value.data.items)
		.catch(error => Promise.reject(handleError(error)));
};

export const setDefaultSenderId = async (
	client: HttpClientModule,
	webuserExtension: string,
	smsId: string,
	senderId: SmsSenderId
): Promise<void> => {
	return client.put(`${webuserExtension}/sms/${smsId}/callerids/${senderId.id}`, {
		defaultNumber: 'true',
	});
};

export const containsPhoneNumber = (
	smsCallerIds: SmsSenderId[],
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
