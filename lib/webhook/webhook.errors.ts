export enum WebhookErrorMessage {
	AUDIO_FORMAT_ERROR = 'Invalid audio format. Please use 16bit PCM WAVE mono audio at 8kHz.',
	INVALID_ORIGIN = 'Caution! IP address is not from sipgate',
	SERVERADDRESS_DOES_NOT_MATCH = 'Given serverAddress does not match with Webhook URLs at console.sipgate.com. Follow-Up events will likely fail.',
	SERVERADDRESS_MISSING_FOR_FOLLOWUPS = 'No serverAddress set. No Follow-Up Events will be sent.',
	SIPGATE_SIGNATURE_VERIFICATION_FAILED = 'Signature verification failed.',
	INVALID_DTMF_MAX_DIGITS = 'Invalid DTMF maxDigits. The max digits should be equal or greater than 1',
	INVALID_DTMF_TIMEOUT = 'Invalid DTMF timeout. The timeout should be equal or greater than 0',
}
