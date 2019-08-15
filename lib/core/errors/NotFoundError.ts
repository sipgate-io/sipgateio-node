import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message?: string) {
    super(message || 'Endpoint not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
