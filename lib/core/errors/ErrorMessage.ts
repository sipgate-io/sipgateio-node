export enum ErrorMessage {
  VALIDATOR_INVALID_EMAIL = 'Invalid email',
  VALIDATOR_INVALID_PASSWORD = 'Invalid password',

  VALIDATOR_INVALID_PHONE_NUMBER = 'Invalid Phone Number',

  VALIDATOR_INVALID_PDF_MIME_TYPE = 'Invalid PDF File',

  SMS_INVALID_EXTENSION = 'Invalid SMS extension',
  SMS_TIME_MUST_BE_IN_FUTURE = 'Time must be in future',

  FAX_STATUS_COULD_NOT_BE_FETCHED = 'Could not fetch the fax status',
  FAX_COULD_NOT_BE_SEND = 'Fax could not be sent',
  FAX_NO_DATA_IN_FETCH_STATUS = 'No data in fetchFaxStatus',
  FAX_NOT_A_FAX = 'History item is not a fax',

  NETWORK_ERROR = 'getaddrinfo ENOTFOUND',
}
