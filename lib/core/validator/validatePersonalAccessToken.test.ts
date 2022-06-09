import { ErrorMessage } from '../errors';
import { validatePersonalAccessToken } from './validatePersonalAccessToken';

describe('Personal Access Token validation', () => {
	test.each`
		input                                     | expected
		${'b03b4d88-640d-49ba-be33-dc8adb97e5e0'} | ${{ isValid: true }}
		${'34615f1f-57cd-85f0-83e8d387569b'}      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PERSONAL_ACCESS_TOKEN }}
		${'text'}                                 | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PERSONAL_ACCESS_TOKEN }}
		${' '}                                    | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PERSONAL_ACCESS_TOKEN }}
		${''}                                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PERSONAL_ACCESS_TOKEN }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validatePersonalAccessToken(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
