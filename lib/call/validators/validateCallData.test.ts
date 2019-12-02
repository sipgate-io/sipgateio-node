import { ErrorMessage } from '../../core/errors';
import { validateCallData } from './validateCallData';

describe('callData validation', () => {
	test.each`
		input                                                                                                 | expected
		${{ callee: '+4915177777777', caller: '+49++', callerId: null, deviceId: null }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+49++', callerId: null, deviceId: 'g5' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+49++', callerId: null, deviceId: 'p0' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+49++', callerId: '+49++', deviceId: null }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+49++', callerId: '+49++', deviceId: 'g5' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+49++', callerId: '+49++', deviceId: 'p0' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+49++', callerId: '+4915177777777', deviceId: null }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+49++', callerId: '+4915177777777', deviceId: 'g5' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+49++', callerId: '+4915177777777', deviceId: 'p0' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: null, deviceId: null }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: null, deviceId: 'g5' }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: null, deviceId: 'p0' }}             | ${{ isValid: true }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: '+49++', deviceId: null }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: '+49++', deviceId: 'g5' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: '+49++', deviceId: 'p0' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: '+4915177777777', deviceId: null }} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: '+4915177777777', deviceId: 'g5' }} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '+4915177777777', caller: '+4915177777777', callerId: '+4915177777777', deviceId: 'p0' }} | ${{ isValid: true }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: null, deviceId: null }}                        | ${{ isValid: true }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: null, deviceId: 'g5' }}                        | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: null, deviceId: 'p0' }}                        | ${{ isValid: true }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: '+49++', deviceId: null }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: '+49++', deviceId: 'g5' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: '+49++', deviceId: 'p0' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: '+4915177777777', deviceId: null }}            | ${{ isValid: true }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: '+4915177777777', deviceId: 'g5' }}            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '+4915177777777', caller: 'e25', callerId: '+4915177777777', deviceId: 'p0' }}            | ${{ isValid: true }}
		${{ callee: '+49++', caller: '+49++', callerId: null, deviceId: null }}                               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: null, deviceId: 'g5' }}                               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: null, deviceId: 'p0' }}                               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+49++', deviceId: null }}                            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+49++', deviceId: 'g5' }}                            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+49++', deviceId: 'p0' }}                            | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+4915177777777', deviceId: null }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+4915177777777', deviceId: 'g5' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+4915177777777', deviceId: 'p0' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: null, deviceId: null }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: null, deviceId: 'g5' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: null, deviceId: 'p0' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: '+49++', deviceId: null }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: '+49++', deviceId: 'g5' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: '+49++', deviceId: 'p0' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: '+4915177777777', deviceId: null }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: '+4915177777777', deviceId: 'g5' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+4915177777777', callerId: '+4915177777777', deviceId: 'p0' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: null, deviceId: null }}                                 | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: null, deviceId: 'g5' }}                                 | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: null, deviceId: 'p0' }}                                 | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+49++', deviceId: null }}                              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+49++', deviceId: 'g5' }}                              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+49++', deviceId: 'p0' }}                              | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+4915177777777', deviceId: null }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+4915177777777', deviceId: 'g5' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+4915177777777', deviceId: 'p0' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
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
