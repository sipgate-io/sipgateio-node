import { HttpError, handleCoreError } from '../../core';

export enum ContactsErrorMessage {
	CONTACTS_INVALID_CSV = 'Invalid CSV string',
	CONTACTS_MISSING_HEADER_FIELD = 'Missing header field in CSV',
	CONTACTS_MISSING_VALUES = 'Missing values in CSV',
	CONTACTS_VCARD_MISSING_BEGIN = 'vCard does not contain a valid BEGIN tag',
	CONTACTS_VCARD_MISSING_END = 'vCard does not contain a valid END tag',
	CONTACTS_VCARD_FAILED_TO_PARSE = 'Failed to parse VCard',
	CONTACTS_INVALID_VCARD_VERSION = 'Invalid VCard Version given',
	CONTACTS_MISSING_NAME_ATTRIBUTE = 'Names not given',
	CONTACTS_MISSING_TEL_ATTRIBUTE = 'No phone number given',
	CONTACTS_INVALID_AMOUNT_OF_NAMES = 'Missing Name Fields',
	CONTACTS_INVALID_AMOUNT_OF_PHONE_NUMBERS = 'Only one phone number is allowed',
	CONTACTS_INVALID_AMOUNT_OF_ADDRESSES = 'Only one address is allowed',
	CONTACTS_INVALID_AMOUNT_OF_ADDRESS_VALUES = 'Address Fields are invalid',
	CONTACTS_INVALID_AMOUNT_OF_EMAILS = 'Only one email is allowed',
}

export const handleContactsError = (error: HttpError<unknown>): Error => {
	if (error.response && error.response.status === 500) {
		return Error(`${ContactsErrorMessage.CONTACTS_INVALID_CSV}`);
	}

	return handleCoreError(error);
};
