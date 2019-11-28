import { CallData, InitiateNewCallSessionResponse } from '../core/models';
import { CallModule } from './call.module';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { validateCallData } from '../core/validator/validateCallData';
import handleCoreError from '../core/errors/handleCoreError';

export const createCallModule = (httpClient: HttpClientModule): CallModule => ({
	async initiate(
		clickToDial: CallData
	): Promise<InitiateNewCallSessionResponse> {
		const clickToDialValidation = validateCallData(clickToDial);
		if (!clickToDialValidation.isValid) {
			throw new Error(clickToDialValidation.cause);
		}

		return httpClient
			.post<InitiateNewCallSessionResponse>('/sessions/calls', clickToDial)
			.then(response => response.data)
			.catch(error => Promise.reject(handleError(error)));
	},
});

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 400) {
		return new Error(ErrorMessage.CALL_BAD_REQUEST);
	}

	if (error.response && error.response.status === 402) {
		return new Error(ErrorMessage.CALL_INSUFFICIENT_FUNDS);
	}

	if (error.response && error.response.status === 403) {
		return new Error(ErrorMessage.CALL_INVALID_EXTENSION);
	}

	return handleCoreError(error);
};
