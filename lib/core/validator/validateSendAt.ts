import { ErrorMessage } from '../errors';
import { ValidationResult } from './validationResult';

const validateSendAt = (sendAt: Date): ValidationResult => {
  if (sendAt.getTime() < Date.now()) {
    return {
      cause: ErrorMessage.SMS_TIME_MUST_BE_IN_FUTURE,
      isValid: false,
    };
  }

  if (sendAt.getTime() > Date.now() + 30 * 24 * 60 * 60 * 1000) {
    return {
      cause: ErrorMessage.SMS_TIME_TOO_FAR_IN_FUTURE,
      isValid: false,
    };
  }

  if (Number.isNaN(sendAt.getTime())) {
    return {
      cause: ErrorMessage.SMS_TIME_INVALID,
      isValid: false,
    };
  }

  return { isValid: true };
};

export { validateSendAt };
