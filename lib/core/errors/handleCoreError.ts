import { HttpError } from '../httpClient';
import { AuthenticationError } from './AuthenticationError';

export default (error: HttpError): Error => {
  if (!error.response) {
    return error;
  }

  if (error.response.status === 401) {
    return new AuthenticationError();
  }

  if (error.response.status === 403) {
    return new AuthenticationError('Forbidden');
  }

  return new Error(error.message);
};
