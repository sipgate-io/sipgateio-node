import { HttpError, handleCoreError } from '../../core';

export enum CallErrorMessage {
	CALL_INVALID_EXTENSION = 'Cannot access extension - not found or forbidden',
	CALL_INSUFFICIENT_FUNDS = 'Insufficient funds',
	CALL_BAD_REQUEST = 'Invalid Call object',
}

export const handleCallError = (error: HttpError): Error => {
	if (error.response && error.response.status === 400) {
		return new Error(CallErrorMessage.CALL_BAD_REQUEST);
	}

	if (error.response && error.response.status === 402) {
		return new Error(CallErrorMessage.CALL_INSUFFICIENT_FUNDS);
	}

	if (error.response && error.response.status === 403) {
		return new Error(CallErrorMessage.CALL_INVALID_EXTENSION);
	}

	return handleCoreError(error);
};
