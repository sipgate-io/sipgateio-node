export enum ErrorMessage {
  VALIDATOR_INVALID_EMAIL = 'Invalid email',
  VALIDATOR_INVALID_PASSWORD = 'Invalid password',

  VALIDATOR_INVALID_PHONE_NUMBER = 'Invalid Phone Number',

  VALIDATOR_INVALID_PDF_MIME_TYPE = 'Invalid PDF File',

  SMS_INVALID_EXTENSION = 'Invalid SMS extension',
  SMS_TIME_MUST_BE_IN_FUTURE = 'Time must be in future',

  FAX_NOT_FOUND = 'Fax was not found',
  FAX_COULD_NOT_BE_SENT = 'Fax could not be sent',
  FAX_NO_DATA_IN_FETCH_STATUS = 'No data in fetchFaxStatus',
  FAX_NOT_A_FAX = 'History item is not a fax',
  FAX_FETCH_STATUS_TIMED_OUT = 'Timeout expired while polling send status',

  NETWORK_ERROR = 'getaddrinfo ENOTFOUND',
}
