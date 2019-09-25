import fileType from 'file-type';
import { ErrorMessage } from '../errors';
import { ValidationResult } from './validator';

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
export { validatePdfFileContent };
