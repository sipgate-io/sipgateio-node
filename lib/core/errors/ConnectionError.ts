import { BaseError } from "./BaseError";

export class ConnectionError extends BaseError {
  constructor(message?: string) {
    super(message || "getaddrinfo ENOTFOUND");
    Object.setPrototypeOf(this, ConnectionError.prototype);
  }
}
