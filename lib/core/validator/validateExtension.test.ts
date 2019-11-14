import { ErrorMessage } from '../errors';
import { ExtensionType, validateExtension } from './validateExtension';

describe('ValidateExtension', () => {
	test.each`
		input    | expected
		${'f0'}  | ${{ isValid: true }}
		${'f01'} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${'b'}   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${'b1'}  | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${' '}   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${''}    | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validateExtension(input, [ExtensionType.FAX]);
			expect(output.isValid).toEqual(expected.isValid);

			if (!output.isValid) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
