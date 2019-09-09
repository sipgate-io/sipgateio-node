import { AuthenticationError } from './AuthenticationError';

export default (error: any) => {
  if (error.response.status === 401) {
    return new AuthenticationError();
  }

  if (error.response.status === 403) {
    return new AuthenticationError('Forbidden');
  }

  return new Error();
};
