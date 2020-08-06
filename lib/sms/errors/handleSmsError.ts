import { HttpError, handleCoreError } from '../../core';

export enum SmsErrorMessage {
	SMS_INVALID_MESSAGE = 'Invalid SMS message',
	SMS_INVALID_EXTENSION = 'Invalid SMS extension',
	SMS_TIME_MUST_BE_IN_FUTURE = 'Scheduled time must be in future',
	SMS_TIME_TOO_FAR_IN_FUTURE = 'Scheduled time should not be further than 30 days in the future',
	SMS_TIME_INVALID = 'Invalid date format',
	SMS_NO_ASSIGNED_ID = 'smsId must be assigned',
	SMS_NO_DEFAULT_SENDER_ID = 'No default SmsId set',
	SMS_NUMBER_NOT_VERIFIED = 'Number is not verified yet',
	SMS_NUMBER_NOT_REGISTERED = 'Number is not registered as a sender ID in your account',
}

export const handleSmsError = (error: HttpError): Error => {
	if (error.response && error.response.status === 403) {
		return new Error(SmsErrorMessage.SMS_INVALID_EXTENSION);
	}
	return handleCoreError(error);
};
