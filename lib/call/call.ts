import { ErrorMessage } from '../core/errors';
import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule, HttpError } from '../core/httpClient';
import {
  InitiateNewCallSessionResponse,
  NewCallRequest,
} from '../core/models/call.model';
import { CallModule } from './call.module';

export const createCallModule = (httpClient: HttpClientModule): CallModule => ({
  async initCall(
    extensionId: string,
    calleeNumber: string,
    callerId: string,
  ): Promise<InitiateNewCallSessionResponse> {
    const newCallRequest: NewCallRequest = {
      callee: calleeNumber,
      caller: extensionId,
      callerId,
    };

    return httpClient
      .post<InitiateNewCallSessionResponse>('/sessions/calls', newCallRequest)
      .then(response => response.data)
      .catch(error => Promise.reject(handleError(error)));
  },
});

const handleError = (error: HttpError): Error => {
  if (!error.response) {
    return error;
  }

  if (error.response.status === 400) {
    return new Error(ErrorMessage.BAD_REQUEST);
  }

  if (error.response.status === 402) {
    return new Error(ErrorMessage.CALL_INSUFFICIENT_FUNDS);
  }

  if (error.response.status === 403) {
    return new Error(ErrorMessage.CALL_INVALID_EXTENSION);
  }

  return handleCoreError(error);
};
