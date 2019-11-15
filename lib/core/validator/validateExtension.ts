import { ErrorMessage } from '../errors';
import { ValidationResult } from './validationResult';

enum ExtensionType {
	APPLICATION = 'a',
	CONFERENCE_ROOM = 'c',
	REGISTER = 'e',
	FAX = 'f',
	GROUP = 'g',
	IVR = 'h',
	SIM = 'i',
	PERSON = 'p',
	QUEUE = 'q',
	CALLTHROUGH = 'r',
	TRUNKING = 't',
	VOICEMAIL = 'v',
	WEBUSER = 'w',
	EXTERNAL = 'x',
	MOBILE = 'y',
}

const validateExtension = (
	extension: string,
	validTypes: ExtensionType[]
): ValidationResult => {
	for (const type of validTypes) {
		const extensionRegEx = new RegExp(`^${type}(0|[1-9][0-9]*)$`);

		if (extensionRegEx.test(extension)) {
			return { isValid: true };
		}
	}

	return {
		cause: `${ErrorMessage.VALIDATOR_INVALID_EXTENSION}: ${extension}`,
		isValid: false,
	};
};

export { validateExtension, ExtensionType };
