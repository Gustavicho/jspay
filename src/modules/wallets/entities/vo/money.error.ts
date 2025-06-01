export class CurrencyMismatchError extends Error {
  constructor(currencyA: string, currencyB: string) {
    super(`Cannot operate on different currencies: ${currencyA} vs ${currencyB}`);
    this.name = "CurrencyMismatchError";
  }
}

export class DivisionByZeroError extends Error {
  constructor() {
    super("Division by zero is not allowed");
    this.name = "DivisionByZeroError";
  }
}

export class InvalidArgumentError extends Error {
  constructor(argumentName: string, reason: string) {
    super(`Invalid argument "${argumentName}": ${reason}`);
    this.name = "InvalidArgumentError";
  }
}
