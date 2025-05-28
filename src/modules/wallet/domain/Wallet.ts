export class Wallet {
  public readonly id: string;
  public readonly userId: string;
  public readonly type: WalletType;
  private _balance: number;
  public readonly createdAt: Date;
  public updatedAt?: Date;

  private constructor(
    id: string,
    userId: string,
    type: WalletType,
    balance: number,
    createdAt: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this._balance = balance;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    userId: string,
    type: WalletType,
    idGenerator: () => string
  ): Wallet {
    return new Wallet(
      idGenerator(),
      userId,
      type,
      0,
      new Date(),
      undefined
    );
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    this._balance += amount;
    this.updatedAt = new Date();
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    if (this.type === WalletType.SAVINGS) {
      throw new Error("Cannot withdraw from a savings wallet");
    }
    if (amount > this._balance) {
      throw new Error("Insufficient balance");
    }
    this._balance -= amount;
    this.updatedAt = new Date();
  }

  transferTo(target: Wallet, amount: number): void {
    if (target.id === this.id) {
      throw new Error("Cannot transfer to the same wallet");
    }
    this.withdraw(amount);
    target.deposit(amount);
  }

  get balance(): number {
    return this._balance;
  }
}

export enum WalletType {
  SAVINGS = "SAVINGS",
  CHECKING = "CHECKING",
}