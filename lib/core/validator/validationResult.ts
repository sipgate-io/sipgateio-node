import { ErrorMessage } from '../errors';

export type ValidationResult =
  | { isValid: true }
  | { isValid: false; cause: ErrorMessage };
