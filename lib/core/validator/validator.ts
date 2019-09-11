import fileType from 'file-type';
import { ErrorMessage } from '../errors';

type ValidationResult =
  | { isValid: true }
  | { isValid: false; cause: ErrorMessage };

const validateEmail = (email: string): ValidationResult => {
  const emailRegex: RegExp = new RegExp(
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  );

  if (!emailRegex.test(email)) {
    return {
      cause: ErrorMessage.VALIDATOR_INVALID_EMAIL,
      isValid: false,
    };
  }

  return { isValid: true };
};

const validatePassword = (password: string): ValidationResult => {
  const passwordIsValid = password.length > 0 && !password.includes(' ');

  if (!passwordIsValid) {
    return { isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD };
  }

  return { isValid: true };
};

const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  const emailRegex: RegExp = new RegExp(/^\+?[0-9]+$/);

  if (!emailRegex.test(phoneNumber)) {
    return {
      cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER,
      isValid: false,
    };
  }

  return { isValid: true };
};

const validatePdfFileContent = (content: Buffer): ValidationResult => {
  const fileTypeResult = fileType(content);

  if (!fileTypeResult || fileTypeResult.mime !== 'application/pdf') {
    return {
      cause: ErrorMessage.VALIDATOR_INVALID_PDF_MIME_TYPE,
      isValid: false,
    };
  }

  return { isValid: true };
};

export {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validatePdfFileContent,
};
