import { ErrorMessage } from "../errors";
import { ValidationResult } from "./validationResult";

const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  const phoneNumberRegex = new RegExp(/^\+?[0-9]+$/);

  if (!phoneNumberRegex.test(phoneNumber)) {
    return {
      cause: ErrorMessage.VALIDATOR_INVALID_PHONE_NUMBER,
      isValid: false
    };
  }

  return { isValid: true };
};
export { validatePhoneNumber };
