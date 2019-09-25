import { ErrorMessage } from '../errors';
import { validateEmail } from './validateEmail';

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
