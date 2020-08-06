import { RTCMCall, RTCMCallsResponse, RTCMModule } from './rtcm.types';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { handleRtcmError } from './errors/handleRtcmError';
import { validateDTMFSequence } from './validator/validateDTMFSequence';

export const createRTCMModule = (client: SipgateIOClient): RTCMModule => ({
	getEstablishedCalls: async (): Promise<RTCMCall[]> => {
		return client
			.get<RTCMCallsResponse>('/calls')
			.then((response) => response.data)
			.catch((error) => Promise.reject(handleRtcmError(error)));
	},
	mute: async (call, status): Promise<void> => {
		await client
			.put(`/calls/${call.callId}/muted`, {
				value: status,
			})
			.catch((error) => Promise.reject(handleRtcmError(error)));
	},
	record: async (call, options): Promise<void> => {
		await client
			.put(`/calls/${call.callId}/recording`, options)
			.catch((error) => Promise.reject(handleRtcmError(error)));
	},
	announce: async (call, announcement): Promise<void> => {
		await client
			.post(`/calls/${call.callId}/announcements`, {
				url: announcement,
			})
			.catch((error) => Promise.reject(handleRtcmError(error)));
	},
	transfer: async (call, options): Promise<void> => {
		await client
			.post(`/calls/${call.callId}/transfer`, options)
			.catch((error) => Promise.reject(handleRtcmError(error)));
	},
	sendDTMF: async (call, sequence): Promise<void> => {
		const upperCasedSequence = sequence.toUpperCase();
		const validationResult = validateDTMFSequence(upperCasedSequence);
		if (!validationResult.isValid) {
			throw new Error(validationResult.cause);
		}

		await client
			.post(`/calls/${call.callId}/dtmf`, {
				sequence: upperCasedSequence,
			})
			.catch((error) => Promise.reject(handleRtcmError(error)));
	},
	hold: async (call, status): Promise<void> => {
		await client
			.put(`/calls/${call.callId}/hold`, {
				value: status,
			})
			.catch((error) => Promise.reject(handleRtcmError(error)));
	},
	hangUp: async (call): Promise<void> => {
		await client
			.delete(`/calls/${call.callId}`)
			.catch((error) => Promise.reject(handleRtcmError(error)));
	},
});
