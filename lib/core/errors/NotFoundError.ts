import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message?: string) {
    super(message || 'Not found.');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
