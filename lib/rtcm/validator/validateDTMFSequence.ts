import { RtcmErrorMessage } from '../errors/handleRtcmError';
import { ValidationResult } from '../../core/validator';

export const validateDTMFSequence = (sequence: string): ValidationResult => {
	if (/^[0-9A-D#*]+$/g.test(sequence)) {
		return { isValid: true };
	}

	return { isValid: false, cause: RtcmErrorMessage.DTMF_INVALID_SEQUENCE };
};
