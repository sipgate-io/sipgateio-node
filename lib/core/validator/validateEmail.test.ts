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
			const output = validateEmail(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);

	it('uses <empty> to display an empty email', () => {
		const output = validateEmail('');

		expect(output.isValid === false);
		if (output.isValid !== false) return;

		expect(output.cause).toContain('<empty>');
	});
});
