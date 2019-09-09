import fileType, { FileTypeResult } from 'file-type';
import fs from 'fs';
import { ErrorMessage } from '../errors/ErrorMessage';
import { ValidationError } from '../errors/ValidationError';

type ValidatorResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      cause: ErrorMessage;
    };

const validateEmail = (email: string): ValidatorResult => {
  const emailRegex: RegExp = new RegExp(
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  );

  if (!emailRegex.test(email)) {
    return {
      cause: ErrorMessage.VALIDATOR_INVALID_EMAIL,
      valid: false,
    };
  }

  return {
    valid: true,
  };
};

const validatePassword = (password: string): ValidatorResult => {
  const passwordIsValid = password.length > 0 && !password.includes(' ');

  if (!passwordIsValid) {
    return { valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD };
  }

  return { valid: true };
};

const validatePhoneNumber = (phoneNumber: string): ValidatorResult => {
  const emailRegex: RegExp = new RegExp(/^\+?[0-9]+$/);

  if (!emailRegex.test(phoneNumber)) {
    return { valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER };
  }

  return { valid: true };
};

const validatePdfFile = (filePath: string): void => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
  } catch (e) {
    throw new ValidationError('File does not exist');
  }

  let type: FileTypeResult | undefined;

  try {
    type = fileType(fs.readFileSync(filePath));
  } catch (e) {
    throw new ValidationError('File is unreadable');
  }

  if (!type || type.mime !== 'application/pdf') {
    throw new ValidationError('Invalid pdf extension');
  }
};

export {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validatePdfFile,
};
