export enum ErrorMessage {
	VALIDATOR_INVALID_EXTENSION = 'Invalid extension',
	VALIDATOR_INVALID_EMAIL = 'Invalid email',
	VALIDATOR_INVALID_PASSWORD = 'Invalid password',
	VALIDATOR_INVALID_PHONE_NUMBER = 'Invalid phone number (please provide number in E.164 format):',
	VALIDATOR_INVALID_OAUTH_TOKEN = 'The provided OAuth token is invalid',

	HTTP_401 = 'Unauthorized',
	HTTP_403 = 'Forbidden',
}
