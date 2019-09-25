import { ErrorMessage } from '../errors';
import { validatePdfFileContent, validatePhoneNumber } from './validator';
import validPDFBuffer from './validPDFBuffer';

describe('Phone validation', () => {
  test.each`
    input               | expected
    ${'015739777777'}   | ${{ isValid: true }}
    ${'+4915739777777'} | ${{ isValid: true }}
    ${'text'}           | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
    ${' '}              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
    ${''}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
  `(
    'validator returns $expected when $input is validated',
    ({ input, expected }) => {
      expect(validatePhoneNumber(input)).toEqual(expected);
    },
  );
});

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
