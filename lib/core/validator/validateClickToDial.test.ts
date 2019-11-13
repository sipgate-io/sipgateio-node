import { ErrorMessage } from '../errors';
import { validateClickToDial } from './validateClickToDial';

describe('ClickToDial validation', () => {
	test.each`
		input                                                                                        | expected
		${{ callee: '01573977777', caller: '+49++', callerId: null, deviceId: null }}                | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '+49++', callerId: null, deviceId: 'g5' }}                | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '+49++', callerId: null, deviceId: 'p0' }}                | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '+49++', callerId: '+49++', deviceId: null }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '+49++', callerId: '+49++', deviceId: 'g5' }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '+49++', callerId: '+49++', deviceId: 'p0' }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '+49++', callerId: '01573977777', deviceId: null }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '+49++', callerId: '01573977777', deviceId: 'g5' }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '+49++', callerId: '01573977777', deviceId: 'p0' }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER }}
		${{ callee: '01573977777', caller: '01573977777', callerId: null, deviceId: null }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ callee: '01573977777', caller: '01573977777', callerId: null, deviceId: 'g5' }}          | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '01573977777', caller: '01573977777', callerId: null, deviceId: 'p0' }}          | ${{ isValid: true }}
		${{ callee: '01573977777', caller: '01573977777', callerId: '+49++', deviceId: null }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ callee: '01573977777', caller: '01573977777', callerId: '+49++', deviceId: 'g5' }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '01573977777', caller: '01573977777', callerId: '+49++', deviceId: 'p0' }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ callee: '01573977777', caller: '01573977777', callerId: '01573977777', deviceId: null }} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID }}
		${{ callee: '01573977777', caller: '01573977777', callerId: '01573977777', deviceId: 'g5' }} | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '01573977777', caller: '01573977777', callerId: '01573977777', deviceId: 'p0' }} | ${{ isValid: true }}
		${{ callee: '01573977777', caller: 'e25', callerId: null, deviceId: null }}                  | ${{ isValid: true }}
		${{ callee: '01573977777', caller: 'e25', callerId: null, deviceId: 'g5' }}                  | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '01573977777', caller: 'e25', callerId: null, deviceId: 'p0' }}                  | ${{ isValid: true }}
		${{ callee: '01573977777', caller: 'e25', callerId: '+49++', deviceId: null }}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ callee: '01573977777', caller: 'e25', callerId: '+49++', deviceId: 'g5' }}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '01573977777', caller: 'e25', callerId: '+49++', deviceId: 'p0' }}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID }}
		${{ callee: '01573977777', caller: 'e25', callerId: '01573977777', deviceId: null }}         | ${{ isValid: true }}
		${{ callee: '01573977777', caller: 'e25', callerId: '01573977777', deviceId: 'g5' }}         | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION }}
		${{ callee: '01573977777', caller: 'e25', callerId: '01573977777', deviceId: 'p0' }}         | ${{ isValid: true }}
		${{ callee: '+49++', caller: '+49++', callerId: null, deviceId: null }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: null, deviceId: 'g5' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: null, deviceId: 'p0' }}                      | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+49++', deviceId: null }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+49++', deviceId: 'g5' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '+49++', deviceId: 'p0' }}                   | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '01573977777', deviceId: null }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '01573977777', deviceId: 'g5' }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '+49++', callerId: '01573977777', deviceId: 'p0' }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: null, deviceId: null }}                | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: null, deviceId: 'g5' }}                | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: null, deviceId: 'p0' }}                | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: '+49++', deviceId: null }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: '+49++', deviceId: 'g5' }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: '+49++', deviceId: 'p0' }}             | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: '01573977777', deviceId: null }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: '01573977777', deviceId: 'g5' }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: '01573977777', callerId: '01573977777', deviceId: 'p0' }}       | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: null, deviceId: null }}                        | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: null, deviceId: 'g5' }}                        | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: null, deviceId: 'p0' }}                        | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+49++', deviceId: null }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+49++', deviceId: 'g5' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '+49++', deviceId: 'p0' }}                     | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '01573977777', deviceId: null }}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '01573977777', deviceId: 'g5' }}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
		${{ callee: '+49++', caller: 'e25', callerId: '01573977777', deviceId: 'p0' }}               | ${{ isValid: false, cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER }}
	`(
		'validator returns $expected when $input is validated',
		({ input, expected }) => {
			expect(validateClickToDial(input)).toEqual(expected);
		}
	);
});
