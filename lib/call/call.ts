import { ErrorMessage } from '../core/errors';
import handleCoreError from '../core/errors/handleCoreError';
import { HttpClientModule, HttpError } from '../core/httpClient';
import {
  ClickToDial,
  InitiateNewCallSessionResponse,
} from '../core/models/call.model';
import { CallModule } from './call.module';

export const createCallModule = (httpClient: HttpClientModule): CallModule => ({
  async initiate(
    newCallRequest: ClickToDial,
  ): Promise<InitiateNewCallSessionResponse> {
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
