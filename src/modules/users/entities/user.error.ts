// user.errors.ts

export default class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }

  static invalidId(id: string): UserError {
    return new UserError(`Invalid user id: '${id}'.`);
  }

  static invalidName(name: string): UserError {
    return new UserError(
      `Invalid name '${name}': name must be at least 3 characters long.`
    );
  }

  static passwordTooShort(): UserError {
    return new UserError(
      "Invalid password: password must be at least 8 characters long."
    );
  }

  static passwordMismatch(): UserError {
    return new UserError("Current password does not match.");
  }

  static userNotActive(userId: string): UserError {
    return new UserError(
      `Operation failed: user '${userId}' is not active.`
    );
  }

  static alreadyActive(userId: string): UserError {
    return new UserError(`User '${userId}' is already active.`);
  }

  static alreadyRemoved(userId: string): UserError {
    return new UserError(`User '${userId}' has already been removed.`);
  }

  static invalidEmail(email: string): UserError {
    return new UserError(`Invalid email format: '${email}'.`);
  }
}
