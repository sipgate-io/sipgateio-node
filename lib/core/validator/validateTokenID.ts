import { ErrorMessage } from '../errors';
import { ValidationResult } from './validator.types';

export const validateTokenID = (tokenID: string): ValidationResult => {
	if (!tokenID.match(/^token-[a-zA-Z\d]{6}$/g)) {
		return {
			isValid: false,
			cause: `${ErrorMessage.VALIDATOR_INVALID_TOKEN_ID}: ${
				tokenID || '<empty>'
			}`,
		};
	}

	return { isValid: true };
};
