import { ErrorMessage } from './errors/ErrorMessage';
import { HttpClientModule, HttpError } from '../core/httpClient';
import { RTCMCall, RTCMCallsResponse, RTCMModule } from './rtcm.types';
import { handleCoreError } from '../core/errors/handleError';
import { validateDTMFSequence } from './validator/validateDTMFSequence';

export const createRTCMModule = (client: HttpClientModule): RTCMModule => ({
	getEstablishedCalls: async (): Promise<RTCMCall[]> => {
		return client
			.get<RTCMCallsResponse>('/calls')
			.then((response) => response.data.data)
			.catch((error) => Promise.reject(handleError(error)));
	},
	mute: async (call, status): Promise<void> => {
		await client
			.put(`/calls/${call.callId}/muted`, {
				value: status,
			})
			.catch((error) => Promise.reject(handleError(error)));
	},
	record: async (call, options): Promise<void> => {
		await client
			.put(`/calls/${call.callId}/recording`, options)
			.catch((error) => Promise.reject(handleError(error)));
	},
	announce: async (call, announcement): Promise<void> => {
		await client
			.post(`/calls/${call.callId}/announcements`, {
				url: announcement,
			})
			.catch((error) => Promise.reject(handleError(error)));
	},
	transfer: async (call, options): Promise<void> => {
		await client
			.post(`/calls/${call.callId}/transfer`, options)
			.catch((error) => Promise.reject(handleError(error)));
	},
	sendDTMF: async (call, sequence): Promise<void> => {
		const upperCasedSequence = sequence.toUpperCase();
		const validationResult = validateDTMFSequence(upperCasedSequence);
		if (!validationResult.isValid) {
			throw new Error(validationResult.cause);
		}

		await client
			.post(`/calls/${call.callId}/dtmf`, {
				upperCasedSequence,
			})
			.catch((error) => Promise.reject(handleError(error)));
	},
	hold: async (call, status): Promise<void> => {
		await client
			.put(`/calls/${call.callId}/hold`, {
				value: status,
			})
			.catch((error) => Promise.reject(handleError(error)));
	},
	hangUp: async (call): Promise<void> => {
		await client
			.delete(`/calls/${call.callId}`)
			.catch((error) => Promise.reject(handleError(error)));
	},
});

const handleError = (error: HttpError): Error => {
	if (error.response && error.response.status === 404) {
		return new Error(ErrorMessage.RTCM_CALL_NOT_FOUND);
	}

	return handleCoreError(error);
};
