import { ErrorMessage } from '../errors/ErrorMessage';
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
    ${'validEmail@test.de'} | ${{ valid: true }}
    ${'invalidEmail'}       | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
    ${'@test.de'}           | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
    ${'@'}                  | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
    ${' '}                  | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
    ${''}                   | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_EMAIL }}
  `(
    'validator returns $expected when $input is validated',
    ({ input, expected }) => {
      expect(validateEmail(input)).toEqual(expected);
    },
  );
});

describe('ValidatePassword', () => {
  test.each`
    input              | expected
    ${'validPassword'} | ${{ valid: true }}
    ${' '}             | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD }}
    ${''}              | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PASSWORD }}
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
    ${'015739777777'}   | ${{ valid: true }}
    ${'+4915739777777'} | ${{ valid: true }}
    ${'text'}           | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
    ${' '}              | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
    ${''}               | ${{ valid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
  `(
    'validator returns $expected when $input is validated',
    ({ input, expected }) => {
      expect(validatePhoneNumber(input)).toEqual(expected);
    },
  );
});

describe('PDF file validation', () => {
  test('should return valid ValidatorResult if pdf file content is valid', () => {
    const validPdfFileContents = validPDFBuffer;

    expect(validatePdfFileContent(validPdfFileContents)).toEqual({
      valid: true,
    });
  });

  test('should return invalid ValidatorResult if file content is invalid', () => {
    const invalidPdfFileContents = Buffer.from('12ABC34');

    expect(validatePdfFileContent(invalidPdfFileContents)).toEqual({
      cause: ErrorMessage.VALIDATOR_INVALID_PDF_MIME_TYPE,
      valid: false,
    });
  });
});
