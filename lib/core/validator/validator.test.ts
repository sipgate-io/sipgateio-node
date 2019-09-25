import { ErrorMessage } from '../errors';
import { validatePdfFileContent } from './validator';
import validPDFBuffer from './validPDFBuffer';

describe('PDF file validation', () => {
  test('should return valid ValidationResult if pdf file content is valid', () => {
    const validPdfFileContents = validPDFBuffer;

    expect(validatePdfFileContent(validPdfFileContents)).toEqual({
      isValid: true,
    });
  });

  test('should return invalid ValidationResult if file content is invalid', () => {
    const invalidPdfFileContents = Buffer.from('12ABC34');

    expect(validatePdfFileContent(invalidPdfFileContents)).toEqual({
      cause: ErrorMessage.VALIDATOR_INVALID_PDF_MIME_TYPE,
      isValid: false,
    });
  });
});
