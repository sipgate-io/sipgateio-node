import { BaseError } from './BaseError';

export class AuthorizationError extends BaseError {
  constructor(message?: string) {
    super(message || 'Wrong Credentials.');
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
