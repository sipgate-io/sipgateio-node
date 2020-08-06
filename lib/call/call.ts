import {
	CallDTO,
	CallData,
	CallModule,
	InitiateNewCallSessionResponse,
} from './call.types';
import { SipgateIOClient } from '../core/sipgateIOClient';
import { handleCallError } from './errors/handleCallError';
import { validateCallData } from './validators/validateCallData';

export const createCallModule = (httpClient: SipgateIOClient): CallModule => ({
	async initiate(
		clickToDial: CallData
	): Promise<InitiateNewCallSessionResponse> {
		const clickToDialValidation = validateCallData(clickToDial);
		if (!clickToDialValidation.isValid) {
			throw new Error(clickToDialValidation.cause);
		}
		const callDTO: CallDTO = {
			callee: clickToDial.to,
			caller: clickToDial.from,
			callerId: clickToDial.callerId,
			deviceId: clickToDial.deviceId,
		};
		return httpClient
			.post<InitiateNewCallSessionResponse>('/sessions/calls', callDTO)
			.catch((error) => Promise.reject(handleCallError(error)));
	},
});
