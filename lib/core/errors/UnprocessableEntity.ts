import { BaseError } from './BaseError';

export class UnprocessableEntity extends BaseError {
  constructor(message?: string) {
    super(message || 'Not found.');
    Object.setPrototypeOf(this, UnprocessableEntity.prototype);
  }
}
