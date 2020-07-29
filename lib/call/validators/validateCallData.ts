import { CallData } from '../models/call.model';
import { ErrorMessage } from '../../core/errors';
import {
	ExtensionType,
	ValidationResult,
	validateExtension,
	validatePhoneNumber,
} from '../../core/validator';

export enum ValidationErrors {
	INVALID_CALLER = 'Caller is not a valid extension or phone number',
	INVALID_CALLER_ID = 'CallerId is not a valid phone number',
	INVALID_DEVICE_ID = 'DeviceId is required if caller is not an extension',
}

const validateCallData = (callData: CallData): ValidationResult => {
	const calleeValidationResult = validatePhoneNumber(
		'to' in callData ? callData.to : callData.callee
	);
	if (!calleeValidationResult.isValid) {
		return { isValid: false, cause: calleeValidationResult.cause };
	}

	const callerPhoneNumberValidationResult = validatePhoneNumber(
		'from' in callData ? callData.from : callData.caller
	);
	const callerExtensionValidationResult = validateExtension(
		'from' in callData ? callData.from : callData.caller,
		[
			ExtensionType.MOBILE,
			ExtensionType.PERSON,
			ExtensionType.EXTERNAL,
			ExtensionType.REGISTER,
		]
	);
	if (
		!callerPhoneNumberValidationResult.isValid &&
		!callerExtensionValidationResult.isValid
	) {
		return {
			isValid: false,
			cause: ValidationErrors.INVALID_CALLER,
		};
	}

	if (callData.deviceId) {
		const deviceIdValidationResult = validateExtension(callData.deviceId, [
			ExtensionType.MOBILE,
			ExtensionType.PERSON,
			ExtensionType.EXTERNAL,
			ExtensionType.REGISTER,
		]);
		if (!deviceIdValidationResult.isValid) {
			return {
				isValid: false,
				cause: ErrorMessage.VALIDATOR_INVALID_EXTENSION,
			};
		}
	} else {
		if (!callerExtensionValidationResult.isValid) {
			return {
				isValid: false,
				cause: ValidationErrors.INVALID_DEVICE_ID,
			};
		}
	}

	if (callData.callerId) {
		const callerIdValidationResult = validatePhoneNumber(callData.callerId);
		if (!callerIdValidationResult.isValid) {
			return {
				isValid: false,
				cause: ValidationErrors.INVALID_CALLER_ID,
			};
		}
	}

	return { isValid: true };
};
export { validateCallData };
