import fileType, { FileTypeResult } from 'file-type';
import * as fs from 'fs';
import { ValidationError } from '../errors/ValidationError';

const validateEmail = (email: string): void => {
  const emailRegex: RegExp = new RegExp(
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  );
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email');
  }
};

const validatePassword = (password: string): void => {
  const isNotValid = password.length === 0 || password.includes(' ');
  if (isNotValid) {
    throw new Error('Invalid password');
  }
};

const validatePhoneNumber = (phoneNumber: string): boolean => {
  const emailRegex: RegExp = new RegExp(/^\+?[0-9]+$/);

  if (!emailRegex.test(phoneNumber)) {
    throw new Error('Invalid Phone Number');
  }

  return true;
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
