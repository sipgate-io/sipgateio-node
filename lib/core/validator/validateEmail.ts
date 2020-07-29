import { ErrorMessage } from '../errors';
import { ValidationResult } from './validator.types';

const validateEmail = (email: string): ValidationResult => {
	const emailRegex = new RegExp(
		/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
	);

	if (!emailRegex.test(email)) {
		return {
			cause: `${ErrorMessage.VALIDATOR_INVALID_EMAIL}: ${email}`,
			isValid: false,
		};
	}

	return { isValid: true };
};
export { validateEmail };
