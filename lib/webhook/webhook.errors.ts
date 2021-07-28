export enum WebhookErrorMessage {
	SERVERADDRESS_MISSING_FOR_FOLLOWUPS = 'No serverAddress set. No Follow-Up Events will be sent.',
	SIPGATE_SIGNATURE_VERIFICATION_FAILED = 'Signature verification failed.',
	AUDIO_FORMAT_ERROR = 'Invalid audio format. Please use 16bit PCM WAVE mono audio at 8kHz.',
	INVALID_ORIGIN = 'Caution! IP address is not from sipgate',
}
