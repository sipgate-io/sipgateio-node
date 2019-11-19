import { ErrorMessage } from '../errors';
import { validatePhoneNumber } from './validatePhoneNumber';

describe('Phone validation', () => {
	test.each`
		input               | expected
		${'+4915739777777'} | ${{ isValid: true }}
		${'+4915739777777'} | ${{ isValid: true }}
		${'text'}           | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${' '}              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${''}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validatePhoneNumber(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
