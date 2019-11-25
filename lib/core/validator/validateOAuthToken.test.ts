import { ErrorMessage } from '../errors';
import { validateOAuthToken } from './validateOAuthToken';
import validOAuthToken from './validOAuthToken';

describe('ValidateOAuthToken', () => {
	test.each`
		input                                         | expected
		${validOAuthToken}                            | ${{ isValid: true }}
		${`header.invalidPayload.${validOAuthToken}`} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_OAUTH_TOKEN }}
		${''}                                         | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_OAUTH_TOKEN }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validateOAuthToken(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
