import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
	constructor(message?: string) {
		super(message || 'Invalid input');
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}
