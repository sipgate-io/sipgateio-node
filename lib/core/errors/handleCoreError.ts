import { AuthenticationError } from './AuthenticationError';

export default (e: any) => {
  if (e.response.status === 401) {
    return new AuthenticationError();
  }

  if (e.response.status === 403) {
    return new AuthenticationError('Forbidden');
  }

  return new Error();
};
