import { AuthenticationError } from './AuthenticationError';

export default (e: any) => {
  if (e.response.status === 401) {
    return new AuthenticationError();
  }

  return new Error();
};
