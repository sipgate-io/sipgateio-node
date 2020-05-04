import { ErrorMessage } from '../errors/ErrorMessage';
import { validateDTMFSequence } from './validateDTMFSequence';

describe('dtmf sequence validation', () => {
	test.each`
		input                     | expected
		${{ sequence: '12 34' }}  | ${{ isValid: false, cause: ErrorMessage.DTMF_INVALID_SEQUENCE }}
		${{ sequence: ' *' }}     | ${{ isValid: false, cause: ErrorMessage.DTMF_INVALID_SEQUENCE }}
		${{ sequence: '0291*' }}  | ${{ isValid: true }}
		${{ sequence: '*100#' }}  | ${{ isValid: true }}
		${{ sequence: '*AaBb#' }} | ${{ isValid: false, cause: ErrorMessage.DTMF_INVALID_SEQUENCE }}
		${{ sequence: 'aa' }}     | ${{ isValid: false, cause: ErrorMessage.DTMF_INVALID_SEQUENCE }}
		${{ sequence: 'A' }}      | ${{ isValid: true }}
		${{ sequence: 'B' }}      | ${{ isValid: true }}
		${{ sequence: 'C' }}      | ${{ isValid: true }}
		${{ sequence: 'D' }}      | ${{ isValid: true }}
		${{ sequence: '1' }}      | ${{ isValid: true }}
		${{ sequence: '2' }}      | ${{ isValid: true }}
		${{ sequence: '3' }}      | ${{ isValid: true }}
		${{ sequence: '4' }}      | ${{ isValid: true }}
		${{ sequence: '5' }}      | ${{ isValid: true }}
		${{ sequence: '6' }}      | ${{ isValid: true }}
		${{ sequence: '7' }}      | ${{ isValid: true }}
		${{ sequence: '8' }}      | ${{ isValid: true }}
		${{ sequence: '9' }}      | ${{ isValid: true }}
		${{ sequence: '' }}       | ${{ isValid: false, cause: ErrorMessage.DTMF_INVALID_SEQUENCE }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validateDTMFSequence(input.sequence);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
