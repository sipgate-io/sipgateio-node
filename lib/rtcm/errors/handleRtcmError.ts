import { HttpError, handleCoreError } from '../../core';

export enum RtcmErrorMessage {
	CALL_NOT_FOUND = 'The requested Call could not be found',
	DTMF_INVALID_SEQUENCE = 'The provided DTMF sequence is invalid',
}

export const handleRtcmError = (error: HttpError): Error => {
	if (error.response && error.response.status === 404) {
		return new Error(RtcmErrorMessage.CALL_NOT_FOUND);
	}

	return handleCoreError(error);
};
