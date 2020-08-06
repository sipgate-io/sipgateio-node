import { ErrorMessage } from './errors/ErrorMessage';
import {
	ExtensionType,
	validateExtension,
	validatePhoneNumber,
} from '../core/validator';
import { HttpClientModule, HttpError } from '../core/sipgateIOClient';
import {
	SMSModule,
	ShortMessage,
	ShortMessageDTO,
	SmsCallerIds,
	SmsExtensions,
	SmsSenderId,
} from './sms.types';
import { getAuthenticatedWebuser } from '../core/helpers/authorizationInfo';
import { handleCoreError } from '../core/errors/handleError';
import { validateSendAt } from './validators/validateSendAt';

export const createSMSModule = (client: HttpClientModule): SMSModule => ({
	async send(sms: ShortMessage, sendAt?: Date): Promise<void> {
		const smsDTO: ShortMessageDTO = {
			smsId: '',
			message: sms.message,
			recipient: sms.to,
		};
		if (sendAt) {
			const sendAtValidationResult = validateSendAt(sendAt);
			if (!sendAtValidationResult.isValid) {
				throw new Error(sendAtValidationResult.cause);
			}
			smsDTO.sendAt = sendAt.getTime() / 1000;
		}
		if (('from' in sms ? sms.from : sms.phoneNumber) !== undefined) {
			return await sendSmsByPhoneNumber(client, sms, smsDTO);
		}
		return await sendSmsBySmsId(sms, smsDTO, client);
	},
});

export const sendSms = async (
	client: HttpClientModule,
	smsDTO: ShortMessageDTO
): Promise<void> => {
	await client.post('/sessions/sms', smsDTO).catch((error) => {
		throw handleError(error);
	});
};

export const getUserSmsExtension = async (
	client: HttpClientModule,
	webuserId: string
): Promise<string> => {
	return client
		.get<SmsExtensions>(`${webuserId}/sms`)
		.then((value) => value.items[0].id)
		.catch((error) => Promise.reject(handleError(error)));
};

export const getSmsCallerIds = async (
	client: HttpClientModule,
	webuserExtension: string,
	smsExtension: string
): Promise<SmsSenderId[]> => {
	return client
		.get<SmsCallerIds>(`${webuserExtension}/sms/${smsExtension}/callerids`)
		.then((value) => value.items)
		.catch((error) => Promise.reject(handleError(error)));
};

export const setDefaultSenderId = async (
	client: HttpClientModule,
	webuserExtension: string,
	smsId: string,
	senderId: SmsSenderId
): Promise<void> => {
	await client
		.put(`${webuserExtension}/sms/${smsId}/callerids/${senderId.id}`, {
			defaultNumber: 'true',
		})
		.catch((error) => {
			throw handleError(error);
		});
};

export const containsPhoneNumber = (
	smsCallerIds: SmsSenderId[],
	phoneNumber: string
): boolean => {
	const foundCallerId = smsCallerIds.find(
		(smsCallerId) => smsCallerId.phonenumber === phoneNumber
	);
	return foundCallerId ? foundCallerId.verified : false;
};

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 403) {
		return new Error(ErrorMessage.SMS_INVALID_EXTENSION);
	}
	return handleCoreError(error);
};

async function sendSmsByPhoneNumber(
	client: HttpClientModule,
	sms: ShortMessage,
	smsDTO: ShortMessageDTO
): Promise<void> {
	const webuserId = await getAuthenticatedWebuser(client);
	const smsExtension = await getUserSmsExtension(client, webuserId);
	const senderIds = await getSmsCallerIds(client, webuserId, smsExtension);
	const senderId = senderIds.find(
		(value) =>
			value.phonenumber === ('from' in sms ? sms.from : sms.phoneNumber)
	);
	if (senderId === undefined) {
		throw new Error(ErrorMessage.SMS_NUMBER_NOT_REGISTERED);
	}
	if (!senderId.verified) {
		throw new Error(ErrorMessage.SMS_NUMBER_NOT_VERIFIED);
	}
	const defaultSmsId = senderIds.find((value) => value.defaultNumber);
	if (defaultSmsId === undefined) {
		throw new Error(ErrorMessage.SMS_NO_DEFAULT_SENDER_ID);
	}
	smsDTO.smsId = smsExtension;
	await setDefaultSenderId(client, webuserId, smsExtension, senderId);
	return await sendSms(client, smsDTO)
		.then(
			async () =>
				await setDefaultSenderId(client, webuserId, smsExtension, defaultSmsId)
		)
		.catch((error) => {
			return Promise.reject(handleError(error));
		});
}

async function sendSmsBySmsId(
	sms: ShortMessage,
	smsDTO: ShortMessageDTO,
	client: HttpClientModule
): Promise<void> {
	if (sms.smsId === undefined) {
		throw new Error('smsId is undefined');
	}
	const smsExtensionValidationResult = validateExtension(sms.smsId, [
		ExtensionType.SMS,
	]);
	if (!smsExtensionValidationResult.isValid) {
		throw new Error(smsExtensionValidationResult.cause);
	}
	smsDTO.smsId = sms.smsId;

	const phoneNumberValidationResult = validatePhoneNumber(sms.to);

	if (!phoneNumberValidationResult.isValid) {
		throw new Error(phoneNumberValidationResult.cause);
	}
	if (sms.message === '') {
		throw new Error(ErrorMessage.SMS_INVALID_MESSAGE);
	}
	return await sendSms(client, smsDTO).catch((error) => {
		throw handleError(error);
	});
}
