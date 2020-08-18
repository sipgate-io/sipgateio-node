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
	async initiate(callData: CallData): Promise<InitiateNewCallSessionResponse> {
		const callDataValidation = validateCallData(callData);
		if (!callDataValidation.isValid) {
			throw new Error(callDataValidation.cause);
		}
		const callDTO: CallDTO = {
			callee: callData.to,
			caller: callData.from,
			callerId: callData.callerId,
			deviceId: callData.deviceId,
		};
		return httpClient
			.post<InitiateNewCallSessionResponse>('/sessions/calls', callDTO)
			.catch((error) => Promise.reject(handleCallError(error)));
	},
});
