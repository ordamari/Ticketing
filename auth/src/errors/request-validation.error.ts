import { ValidationError } from "express-validator";
import { FormattedError } from "../types/formattedError.type";
import { CustomError } from "./custom.error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  private formattedValidationError = (
    error: ValidationError
  ): FormattedError => {
    if (error.type === "field") {
      return { message: error.msg, field: error.path };
    }
    return { message: error.msg };
  };

  serializeErrors() {
    return this.errors.map(this.formattedValidationError);
  }
}
