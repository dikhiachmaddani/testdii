import { InvariantError } from "./invariant-error.exception.js";
import { ValidationError } from "./validation-error.exception.js";

export const DomainErrorTranslator = {
  _directories: new Map<string, Error>([
    [
      "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY",
      new InvariantError("must contain email and password"),
    ],
    [
      "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION",
      new InvariantError("must contain email and password"),
    ],
    [
      "JWT_TOKEN_MANAGER.DECODE_PAYLOAD_FAILED",
      new InvariantError("token is invalid"),
    ],
    [
      "JWT_TOKEN_MANAGER.VERIFY_ACCESS_TOKEN_FAILED",
      new InvariantError("token is invalid"),
    ],
    [
      "JWT_TOKEN_MANAGER.VERIFY_REFRESH_TOKEN_FAILED",
      new InvariantError("token is invalid"),
    ],
    [
      "JWT_TOKEN_MANAGER.CREATE_ACCESS_TOKEN_FAILED",
      new InvariantError("token is invalid"),
    ],
    [
      "JWT_TOKEN_MANAGER.CREATE_REFRESH_TOKEN_FAILED",
      new InvariantError("token is invalid"),
    ],
    [
      "USER_REGISTER.NOT_CONTAIN_NEEDED_PROPERTY",
      new InvariantError("must contain email, password, and name"),
    ],
    [
      "USER_REGISTER.NOT_MEET_DATA_TYPE_SPECIFICATION",
      new InvariantError("must contain email, password, and name"),
    ],
    [
      "USER_REGISTER.EMAIL_ALREADY_USE",
      new InvariantError("email already use"),
    ],
  ]),

  translate(error: Error) {
    // Handle ValidationError specially
    if (error instanceof ValidationError) {
      return error;
    }

    return this._directories.get(error.message) || error;
  },
};

export default DomainErrorTranslator;
