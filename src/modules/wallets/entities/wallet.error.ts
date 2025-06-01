import Money from "./vo/money.object";

export default class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }

  static notFound(walletId: string) {
    return new WalletError(
      `Could not retrieve wallet '${walletId}': wallet does not exist.`
    );
  }

  static alreadyRemoved(walletId: string) {
    return new WalletError(
      `Cannot remove wallet '${walletId}': it has already been removed.`
    );
  }

  static notActive(walletId: string) {
    return new WalletError(
      `Operation failed: wallet '${walletId}' is not active.`
    );
  }

  static hasBalance(walletId: string, currentBalance: Money) {
    return new WalletError(
      `Cannot remove wallet '${walletId}': current balance is ${currentBalance.format()}, but it must be zero.`
    );
  }

  static alreadyActive(walletId: string) {
    return new WalletError(
      `Cannot activate wallet '${walletId}': it is already active.`
    );
  }

  static insufficientBalance(
    walletId: string,
    currentBalance: Money,
    required: Money
  ) {
    return new WalletError(
      `Insufficient balance in wallet '${walletId}'. ` +
      `Current balance: ${currentBalance.format()}, required: ${required.format()}.`
    );
  }
}
