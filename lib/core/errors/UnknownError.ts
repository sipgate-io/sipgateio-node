import { BaseError } from './BaseError';

export class UnknownError extends BaseError {
  constructor(message?: string) {
    super(message || 'Unknown error.');
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
