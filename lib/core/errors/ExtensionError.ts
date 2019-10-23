import { BaseError } from "./BaseError";

export class ExtensionError extends BaseError {
  constructor(message?: string) {
    super(message || "Invalid Extension");
    Object.setPrototypeOf(this, ExtensionError.prototype);
  }
}
