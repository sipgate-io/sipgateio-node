import { CallModule } from './call.module';
import {
	ClickToDial,
	InitiateNewCallSessionResponse,
} from '../core/models/call.model';
import { ErrorMessage } from '../core/errors';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { validateClickToDial } from '../core/validator/validateClickToDial';
import handleCoreError from '../core/errors/handleCoreError';

export const createCallModule = (httpClient: HttpClientModule): CallModule => ({
	async initiate(
		clickToDial: ClickToDial
	): Promise<InitiateNewCallSessionResponse> {
		const clickToDialValidation = validateClickToDial(clickToDial);
		if (!clickToDialValidation.isValid) {
			throw new Error(
				`${clickToDialValidation.cause}: ${JSON.stringify(clickToDial)}`
			);
		}

		return httpClient
			.post<InitiateNewCallSessionResponse>('/sessions/calls', clickToDial)
			.then(response => response.data)
			.catch(error => Promise.reject(handleError(error)));
	},
});

const handleError = (error: HttpError): Error => {
	if (!error.response) {
		return error;
	}

	if (error.response.status === 400) {
		return new Error(ErrorMessage.CALL_BAD_REQUEST);
	}

	if (error.response.status === 402) {
		return new Error(ErrorMessage.CALL_INSUFFICIENT_FUNDS);
	}

	if (error.response.status === 403) {
		return new Error(ErrorMessage.CALL_INVALID_EXTENSION);
	}

	return handleCoreError(error);
};
