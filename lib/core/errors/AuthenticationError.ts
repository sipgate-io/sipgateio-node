import { BaseError } from "./BaseError";

export class AuthenticationError extends BaseError {
  constructor(message?: string) {
    super(message || "Invalid login credentials");
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
