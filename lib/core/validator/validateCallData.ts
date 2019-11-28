import { CallData } from '../models';
import { ErrorMessage } from '../errors';
import { ExtensionType, validateExtension } from './validateExtension';
import { ValidationResult } from './validationResult';
import { validatePhoneNumber } from './validatePhoneNumber';

const validateCallData = (callData: CallData): ValidationResult => {
	const calleeValidationResult = validatePhoneNumber(callData.callee);
	if (!calleeValidationResult.isValid) {
		return { isValid: false, cause: calleeValidationResult.cause };
	}

	const callerPhoneNumberValidationResult = validatePhoneNumber(
		callData.caller
	);
	const callerExtensionValidationResult = validateExtension(callData.caller, [
		ExtensionType.MOBILE,
		ExtensionType.PERSON,
		ExtensionType.EXTERNAL,
		ExtensionType.REGISTER,
	]);
	if (
		!callerPhoneNumberValidationResult.isValid &&
		!callerExtensionValidationResult.isValid
	) {
		return {
			isValid: false,
			cause: ErrorMessage.VALIDATOR_INVALID_CALLER,
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
				cause: ErrorMessage.VALIDATOR_INVALID_DEVICE_ID,
			};
		}
	}

	if (callData.callerId) {
		const callerIdValidationResult = validatePhoneNumber(callData.callerId);
		if (!callerIdValidationResult.isValid) {
			return {
				isValid: false,
				cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID,
			};
		}
	}

	return { isValid: true };
};
export { validateCallData };
