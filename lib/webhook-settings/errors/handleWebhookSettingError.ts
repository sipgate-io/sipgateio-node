import { HttpError, handleCoreError } from '../../core';

export enum WebhookSettingsErrorMessage {
	WEBHOOK_SETTINGS_FEATURE_NOT_BOOKED = 'sipgateIO is not booked for your account',
}

export const handleWebhookSettingsError = (error: HttpError): Error => {
	if (error.response && error.response.status === 403) {
		return new Error(
			WebhookSettingsErrorMessage.WEBHOOK_SETTINGS_FEATURE_NOT_BOOKED
		);
	}
	return handleCoreError(error);
};
