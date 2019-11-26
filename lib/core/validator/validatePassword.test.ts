import { ErrorMessage } from '../errors';
import { validatePassword } from './validatePassword';

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
			const output = validatePassword(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
