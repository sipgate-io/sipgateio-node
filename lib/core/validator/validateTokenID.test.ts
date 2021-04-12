import { ErrorMessage } from '../errors';
import { validateTokenID } from '.';

describe('Token id validation', () => {
	test.each`
		input               | expected
		${'token-6DSA7A'}   | ${{ isValid: true }}
		${'token-93426892'} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_TOKEN_ID }}
		${'text'}           | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_TOKEN_ID }}
		${' '}              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_TOKEN_ID }}
		${''}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_TOKEN_ID }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validateTokenID(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
