import { ErrorMessage } from '../errors';
import { ValidationResult } from './validationResult';

const validatePassword = (password: string): ValidationResult => {
	const passwordIsValid = password.length > 0 && !password.includes(' ');

	if (!passwordIsValid) {
		return { isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD };
	}

	return { isValid: true };
};
export { validatePassword };
