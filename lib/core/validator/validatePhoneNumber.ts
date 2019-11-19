import { ErrorMessage } from '../errors';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { ValidationResult } from './validationResult';

const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
	const phoneNumberUtil = PhoneNumberUtil.getInstance();
	try {
		const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumber);
		phoneNumberUtil.format(parsedPhoneNumber, PhoneNumberFormat.E164);

		return { isValid: true };
	} catch (exception) {
		return {
			cause: `${ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER}: ${phoneNumber}`,
			isValid: false,
		};
	}
};
export { validatePhoneNumber };
