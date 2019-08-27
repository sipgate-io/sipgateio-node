import { AuthenticationError } from './AuthenticationError';
import handleCoreError from './handleCoreError';

describe('handleCoreError', () => {
  test('AuthenticationError', () => {
    const error = { response: { status: 401 } };
    expect(handleCoreError(error)).toEqual(new AuthenticationError());
  });

  test('AccessError', () => {
    const error = { response: { status: 403 } };
    expect(handleCoreError(error)).toEqual(
      new AuthenticationError('Forbidden'),
    );
  });

  test('Catch all errors', () => {
    const error = { response: { status: 3.1415 } };
    expect(handleCoreError(error)).toEqual(new Error());
  });
});
