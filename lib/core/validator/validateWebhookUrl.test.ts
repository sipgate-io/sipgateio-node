import { ErrorMessage } from '../errors';
import { validateWebhookUrl } from './validateWebhookUrl';

describe('ValidateWebhookUrl', () => {
	test.each`
		input                  | expected
		${'http://'}           | ${{ isValid: true }}
		${'https://'}          | ${{ isValid: true }}
		${'https://valid.com'} | ${{ isValid: true }}
		${'httptest://'}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL }}
		${''}                  | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL }}
		${'httpsx'}            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL }}
		${'://'}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL }}
		${'www.url.com'}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_WEBHOOK_URL }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validateWebhookUrl(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
