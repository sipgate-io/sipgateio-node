import { ErrorMessage } from '../../core/errors';
import { validateCallData } from './validateCallData';

describe('callData validation', () => {
	test.each`
		input                                                                                           | expected
		${{ to: '+4915177777777', from: '+49++', callerId: null, deviceId: null }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+49++', callerId: null, deviceId: 'g5' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+49++', callerId: null, deviceId: 'p0' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+49++', callerId: '+49++', deviceId: null }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+49++', callerId: '+49++', deviceId: 'g5' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+49++', callerId: '+49++', deviceId: 'p0' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+49++', callerId: '+4915177777777', deviceId: null }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+49++', callerId: '+4915177777777', deviceId: 'g5' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+49++', callerId: '+4915177777777', deviceId: 'p0' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: null, deviceId: null }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: null, deviceId: 'g5' }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: null, deviceId: 'p0' }}             | ${{ isValid: true }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: '+49++', deviceId: null }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: '+49++', deviceId: 'g5' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: '+49++', deviceId: 'p0' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: '+4915177777777', deviceId: null }} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: '+4915177777777', deviceId: 'g5' }} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ to: '+4915177777777', from: '+4915177777777', callerId: '+4915177777777', deviceId: 'p0' }} | ${{ isValid: true }}
		${{ to: '+4915177777777', from: 'e25', callerId: null, deviceId: null }}                        | ${{ isValid: true }}
		${{ to: '+4915177777777', from: 'e25', callerId: null, deviceId: 'g5' }}                        | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ to: '+4915177777777', from: 'e25', callerId: null, deviceId: 'p0' }}                        | ${{ isValid: true }}
		${{ to: '+4915177777777', from: 'e25', callerId: '+49++', deviceId: null }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ to: '+4915177777777', from: 'e25', callerId: '+49++', deviceId: 'g5' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ to: '+4915177777777', from: 'e25', callerId: '+49++', deviceId: 'p0' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ to: '+4915177777777', from: 'e25', callerId: '+4915177777777', deviceId: null }}            | ${{ isValid: true }}
		${{ to: '+4915177777777', from: 'e25', callerId: '+4915177777777', deviceId: 'g5' }}            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ to: '+4915177777777', from: 'e25', callerId: '+4915177777777', deviceId: 'p0' }}            | ${{ isValid: true }}
		${{ to: '+49++', from: '+49++', callerId: null, deviceId: null }}                               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+49++', callerId: null, deviceId: 'g5' }}                               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+49++', callerId: null, deviceId: 'p0' }}                               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+49++', callerId: '+49++', deviceId: null }}                            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+49++', callerId: '+49++', deviceId: 'g5' }}                            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+49++', callerId: '+49++', deviceId: 'p0' }}                            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+49++', callerId: '+4915177777777', deviceId: null }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+49++', callerId: '+4915177777777', deviceId: 'g5' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+49++', callerId: '+4915177777777', deviceId: 'p0' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: null, deviceId: null }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: null, deviceId: 'g5' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: null, deviceId: 'p0' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: '+49++', deviceId: null }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: '+49++', deviceId: 'g5' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: '+49++', deviceId: 'p0' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: '+4915177777777', deviceId: null }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: '+4915177777777', deviceId: 'g5' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: '+4915177777777', callerId: '+4915177777777', deviceId: 'p0' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: null, deviceId: null }}                                 | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: null, deviceId: 'g5' }}                                 | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: null, deviceId: 'p0' }}                                 | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: '+49++', deviceId: null }}                              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: '+49++', deviceId: 'g5' }}                              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: '+49++', deviceId: 'p0' }}                              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: '+4915177777777', deviceId: null }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: '+4915177777777', deviceId: 'g5' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ to: '+49++', from: 'e25', callerId: '+4915177777777', deviceId: 'p0' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			const output = validateCallData(input);
			expect(output.isValid).toEqual(expected.isValid);

			if (output.isValid === false) {
				expect(output.cause).toContain(expected.cause);
			}
		}
	);
});
