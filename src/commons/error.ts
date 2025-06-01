export class InvalidArgumentError extends Error {
  constructor(argumentName: string, detail: string) {
    super(`Invalid argument '${argumentName}': ${detail}.`);
    this.name = "InvalidArgumentError";
  }
}

export class UnauthorizedError extends Error {
  constructor(detail: string) {
    super(`Unauthorized: ${detail}.`);
    this.name = "UnauthorizedError";
  }
}