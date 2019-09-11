import { ErrorMessage } from '../errors';
import {
  validateEmail,
  validatePassword,
  validatePdfFileContent,
  validatePhoneNumber,
} from './validator';
import validPDFBuffer from './validPDFBuffer';

describe('ValidateEmail', () => {
  test.each`
    input                   | expected
    ${'validEmail@test.de'} | ${{ isValid: true }}
    ${'invalidEmail'}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
    ${'@test.de'}           | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
    ${'@'}                  | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
    ${' '}                  | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
    ${''}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
  `(
    'validator returns $expected when $input is validated',
    ({ input, expected }) => {
      expect(validateEmail(input)).toEqual(expected);
    },
  );
});

describe('ValidatePassword', () => {
  test.each`
    input                 | expected
    ${'validPassword'}    | ${{ isValid: true }}
    ${'invalid password'} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD }}
    ${' '}                | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD }}
    ${''}                 | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD }}
  `(
    'validator returns $expected when $input is validated',
    ({ input, expected }) => {
      expect(validatePassword(input)).toEqual(expected);
    },
  );
});

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
