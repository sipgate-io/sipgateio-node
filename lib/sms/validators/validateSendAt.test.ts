import { SmsErrorMessage } from '../errors/handleSmsError';
import { validateSendAt } from './validateSendAt';

describe('ValidateSendAt', () => {
	const inOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const threeSecondsAgo = new Date(Date.now() - 3 * 1000);
	const inFortyDays = new Date(Date.now() + 40 * 24 * 60 * 60 * 1000);

	test.each`
		input              | expected
		${inOneDay}        | ${{ isValid: true }}
		${threeSecondsAgo} | ${{ isValid: false, cause: SmsErrorMessage.TIME_MUST_BE_IN_FUTURE }}
		${inFortyDays}     | ${{ isValid: false, cause: SmsErrorMessage.TIME_TOO_FAR_IN_FUTURE }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			expect(validateSendAt(input)).toEqual(expected);
		}
	);
});
