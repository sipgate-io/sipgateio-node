import { ErrorMessage } from '../errors';
import { validatePhoneNumber } from './validatePhoneNumber';

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
		}
	);
});
