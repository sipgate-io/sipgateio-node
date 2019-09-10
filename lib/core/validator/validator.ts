import fileType from 'file-type';
import { ErrorMessage } from '../errors/ErrorMessage';

type ValidationResult = { valid: true } | { valid: false; cause: ErrorMessage };

const validateEmail = (email: string): ValidationResult => {
  const emailRegex: RegExp = new RegExp(
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  );

  if (!emailRegex.test(email)) {
    return {
      cause: ErrorMessage.VALIDATOR_INVALID_EMAIL,
      valid: false,
    };
  }

  return { valid: true };
};

const validatePassword = (password: string): ValidationResult => {
  const passwordIsValid = password.length > 0 && !password.includes(' ');

  if (!passwordIsValid) {
    return { valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD };
  }

  return { valid: true };
};

const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  const emailRegex: RegExp = new RegExp(/^\+?[0-9]+$/);

  if (!emailRegex.test(phoneNumber)) {
    return { valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER };
  }

  return { valid: true };
};

const validatePdfFileContent = (content: Buffer): ValidationResult => {
  const fileTypeResult = fileType(content);

  if (!fileTypeResult || fileTypeResult.mime !== 'application/pdf') {
    return {
      cause: ErrorMessage.VALIDATOR_INVALID_PDF_MIME_TYPE,
      valid: false,
    };
  }

  return { valid: true };
};

export {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validatePdfFileContent,
};
