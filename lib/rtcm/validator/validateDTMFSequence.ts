import { ErrorMessage } from '../errors/ErrorMessage';
import { ValidationResult } from '../../core/validator';

export const validateDTMFSequence = (sequence: string): ValidationResult => {
	if (/^[0-9A-D#*]+$/g.test(sequence)) {
		return { isValid: true };
	}

	return { isValid: false, cause: ErrorMessage.DTMF_INVALID_SEQUENCE };
};
