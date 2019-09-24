export enum ErrorMessage {
  VALIDATOR_INVALID_EXTENSION = 'Invalid extension',
  VALIDATOR_INVALID_EMAIL = 'Invalid email',
  VALIDATOR_INVALID_PASSWORD = 'Invalid password',
  VALIDATOR_INVALID_PHONE_NUMBER = 'Invalid Phone Number',

  VALIDATOR_INVALID_PDF_MIME_TYPE = 'Invalid PDF File',

  SMS_INVALID_EXTENSION = 'Invalid SMS extension',
  SMS_TIME_MUST_BE_IN_FUTURE = 'Time must be in future',
  SMS_TIME_TOO_FAR_IN_FUTURE = 'Please select a date no further than 30 days in the future',

  FAX_NOT_FOUND = 'Fax was not found',
  FAX_COULD_NOT_BE_SENT = 'Fax could not be sent',
  FAX_NO_DATA_IN_FETCH_STATUS = 'No data in fetchFaxStatus',
  FAX_NOT_A_FAX = 'History item is not a fax',
  FAX_FETCH_STATUS_TIMED_OUT = 'Timeout expired while polling send status',

  CALL_INVALID_EXTENSION = 'Invalid Call Extension',
  CALL_INSUFFICIENT_FUNDS = 'Insufficient funds',
  CALL_BAD_REQUEST = 'Invalid Call object',

  NETWORK_ERROR = 'getaddrinfo ENOTFOUND',
}
