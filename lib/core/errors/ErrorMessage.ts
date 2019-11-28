export enum ErrorMessage {
	VALIDATOR_INVALID_EXTENSION = 'Invalid extension',
	VALIDATOR_INVALID_EXTENSION_FOR_WEBHOOKS = "Whitelist allows only 'p' and 'g' extensions",
	VALIDATOR_INVALID_EMAIL = 'Invalid email',
	VALIDATOR_INVALID_PASSWORD = 'Invalid password',
	VALIDATOR_INVALID_PHONE_NUMBER = 'Invalid phone number (please provide number in E.164 format):',
	VALIDATOR_INVALID_PDF_MIME_TYPE = 'Invalid PDF file',
	VALIDATOR_INVALID_WEBHOOK_URL = 'Invalid webhook URL',
	VALIDATOR_INVALID_CALLER = 'Caller is not a valid extension or phone number',
	VALIDATOR_INVALID_CALLER_ID = 'CallerId is not a valid phone number',
	VALIDATOR_INVALID_DEVICE_ID = 'DeviceId is required if caller is not a extension',
	VALIDATOR_INVALID_OAUTH_TOKEN = 'The provided OAuth token is invalid',

	SMS_INVALID_MESSAGE = 'Invalid SMS message',
	SMS_INVALID_EXTENSION = 'Invalid SMS extension',
	SMS_TIME_MUST_BE_IN_FUTURE = 'Scheduled time must be in future',
	SMS_TIME_TOO_FAR_IN_FUTURE = 'Scheduled time should not be further than 30 days in the future',
	SMS_TIME_INVALID = 'Invalid date format',

	FAX_NOT_FOUND = 'Fax was not found',
	FAX_NOT_A_FAX = 'History item is not a fax',
	CALL_INVALID_EXTENSION = 'Cannot access extension - not found or forbidden',
	CALL_INSUFFICIENT_FUNDS = 'Insufficient funds',
	CALL_BAD_REQUEST = 'Invalid Call object',

	CONTACTS_INVALID_CSV = 'Invalid CSV string',
	CONTACTS_MISSING_HEADER_FIELD = 'Missing header field in CSV',
	CONTACTS_MISSING_VALUES = 'Missing values in CSV',

	WEBHOOK_SETTINGS_FEATURE_NOT_BOOKED = 'sipgateIO is not booked for your account',

	HTTP_401 = 'Unauthorized',
	HTTP_403 = 'Forbidden',
}
