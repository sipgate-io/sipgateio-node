import { ClickToDial } from '../models/call.model';
import { ErrorMessage } from '../errors';
import { ExtensionType, validateExtension } from './validateExtension';
import { ValidationResult } from './validationResult';
import { validatePhoneNumber } from './validatePhoneNumber';

const validateClickToDial = (clickToDial: ClickToDial): ValidationResult => {
	const calleeValidationResult = validatePhoneNumber(clickToDial.callee);
	if (!calleeValidationResult.isValid) {
		return { isValid: false, cause: calleeValidationResult.cause };
	}

	const callerPhoneNumberValidationResult = validatePhoneNumber(
		clickToDial.caller
	);
	const callerExtensionValidationResult = validateExtension(
		clickToDial.caller,
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
			cause: ErrorMessage.VALIDATOR_INVALID_CALLER,
		};
	}

	if (clickToDial.deviceId) {
		const deviceIdValidationResult = validateExtension(clickToDial.deviceId, [
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

	if (clickToDial.callerId) {
		const callerIdValidationResult = validatePhoneNumber(clickToDial.callerId);
		if (!callerIdValidationResult.isValid) {
			return {
				isValid: false,
				cause: ErrorMessage.VALIDATOR_INVALID_CALLER_ID,
			};
		}
	}

	return { isValid: true };
};
export { validateClickToDial };
