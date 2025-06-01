export default class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionError";
  }

  static invalidAmount(): TransactionError {
    return new TransactionError("Invalid amount: must be greater than zero.");
  }

  static sameSenderReceiver(): TransactionError {
    return new TransactionError(
      "Sender and receiver cannot be the same for a transfer."
    );
  }

  static invalidStatusTransition(
    current: string,
    attempted: string
  ): TransactionError {
    return new TransactionError(
      `Cannot change status from '${current}' to '${attempted}'.`
    );
  }

  static invalidType(type: string): TransactionError {
    return new TransactionError(`Invalid transaction type: '${type}'.`);
  }
}
