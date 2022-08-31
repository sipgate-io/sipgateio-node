import {
	ExtensionType,
	validateExtension,
	validatePhoneNumber,
} from '../core/validator';
import {
	SMSModule,
	ShortMessage,
	ShortMessageDTO,
	SmsExtension,
	SmsSenderId,
} from './sms.types';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { SmsErrorMessage, handleSmsError } from './errors/handleSmsError';
import { validateSendAt } from './validators/validateSendAt';

export const createSMSModule = (client: SipgateIOClient): SMSModule => ({
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
			return sendSmsByPhoneNumber(client, sms, smsDTO);
		}
		return sendSmsBySmsId(sms, smsDTO, client);
	},
});

const sendSms = async (
	client: SipgateIOClient,
	smsDTO: ShortMessageDTO
): Promise<void> => {
	await client.post('/sessions/sms', smsDTO).catch((error) => {
		throw handleSmsError(error);
	});
};

export const getUserSmsExtension = (
	client: SipgateIOClient,
	webuserId: string
): Promise<string> => {
	return client
		.get<{ items: SmsExtension[] }>(`${webuserId}/sms`)
		.then((value) => value.items[0].id)
		.catch((error) => Promise.reject(handleSmsError(error)));
};

export const getSmsCallerIds = (
	client: SipgateIOClient,
	webuserExtension: string,
	smsExtension: string
): Promise<SmsSenderId[]> => {
	return client
		.get<{ items: SmsSenderId[] }>(
			`${webuserExtension}/sms/${smsExtension}/callerids`
		)
		.then((value) => value.items)
		.catch((error) => Promise.reject(handleSmsError(error)));
};

const setDefaultSenderId = async (
	client: SipgateIOClient,
	webuserExtension: string,
	smsId: string,
	senderId: SmsSenderId
): Promise<void> => {
	await client
		.put(`${webuserExtension}/sms/${smsId}/callerids/${senderId.id}`, {
			defaultNumber: 'true',
		})
		.catch((error) => {
			throw handleSmsError(error);
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

async function sendSmsByPhoneNumber(
	client: SipgateIOClient,
	sms: ShortMessage,
	smsDTO: ShortMessageDTO
): Promise<void> {
	const webuserId = await client.getAuthenticatedWebuserId();
	const smsExtension = await getUserSmsExtension(client, webuserId);
	const senderIds = await getSmsCallerIds(client, webuserId, smsExtension);
	const senderId = senderIds.find(
		(value) =>
			value.phonenumber === ('from' in sms ? sms.from : sms.phoneNumber)
	);
	if (senderId === undefined) {
		throw new Error(SmsErrorMessage.NUMBER_NOT_REGISTERED);
	}
	if (!senderId.verified) {
		throw new Error(SmsErrorMessage.NUMBER_NOT_VERIFIED);
	}
	const defaultSmsId = senderIds.find((value) => value.defaultNumber);
	if (defaultSmsId === undefined) {
		throw new Error(SmsErrorMessage.NO_DEFAULT_SENDER_ID);
	}
	smsDTO.smsId = smsExtension;
	await setDefaultSenderId(client, webuserId, smsExtension, senderId);
	return await sendSms(client, smsDTO)
		.then(
			async () =>
				await setDefaultSenderId(client, webuserId, smsExtension, defaultSmsId)
		)
		.catch((error) => {
			return Promise.reject(handleSmsError(error));
		});
}

async function sendSmsBySmsId(
	sms: ShortMessage,
	smsDTO: ShortMessageDTO,
	client: SipgateIOClient
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
		throw new Error(SmsErrorMessage.INVALID_MESSAGE);
	}
	await sendSms(client, smsDTO).catch((error) => {
		throw handleSmsError(error);
	});
}
