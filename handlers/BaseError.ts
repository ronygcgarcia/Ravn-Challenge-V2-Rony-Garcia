export default class BaseError extends Error {
  name: string;
  description: string;
  statusCode: number;
  constructor(name: string, statusCode: number, description: string) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.description = description;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}
