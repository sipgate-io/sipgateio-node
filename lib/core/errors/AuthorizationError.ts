import { BaseError } from './BaseError';

export class AuthorizationError extends BaseError {
  constructor(message?: string) {
    super(message || 'Invalid login credentials');
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
