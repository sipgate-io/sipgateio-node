import { ErrorMessage } from '../errors';
import { ValidationResult } from './validator.types';

export const validatePersonalAccessToken = (
	token: string
): ValidationResult => {
	if (
		!token.match(
			/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/gi
		)
	) {
		return {
			isValid: false,
			cause: `${ErrorMessage.VALIDATOR_INVALID_PERSONAL_ACCESS_TOKEN}: ${
				token || '<empty>'
			}`,
		};
	}

	return { isValid: true };
};
