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
			cause: 'caller is not a valid extension nor phone number' as ErrorMessage,
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
				cause: 'deviceId is mandatory if caller is not a extension' as ErrorMessage,
			};
		}
	}

	if (clickToDial.callerId) {
		const callerIdValidationResult = validatePhoneNumber(clickToDial.callerId);
		if (!callerIdValidationResult.isValid) {
			return { isValid: false, cause: 'Invalid callerId' as ErrorMessage };
		}
	}

	return { isValid: true };
};
export { validateClickToDial };
