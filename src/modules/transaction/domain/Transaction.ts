export default class Transaction {
  public readonly id: string;
  private _status: TransactionStatus;
  public get status() { return this._status; }
  public readonly createdAt: Date;
  public updatedAt?: Date;

  private constructor(
    id: string,
    public readonly fromWalletId: string,
    public readonly toWalletId: string,
    public readonly amount: number,
    public readonly type: TransactionType,
    status: TransactionStatus,
    public readonly category: TransactionCategory,
    public description: string,
    createdAt: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this._status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    type: TransactionType,
    category: TransactionCategory,
    description: string,
    idGenerator: () => string
  ): Transaction {
    if (amount <= 0) throw new Error("Amount must be positive");

    return new Transaction(
      idGenerator(),
      fromWalletId,
      toWalletId,
      amount,
      type,
      TransactionStatus.PENDING,
      category,
      description,
      new Date(),
      undefined
    );
  }

  approve() {
    if (this._status !== TransactionStatus.PENDING) {
      throw new Error("Only pending tx can be approved");
    }
    this._status = TransactionStatus.APPROVED;
    this.updatedAt = new Date();
  }

  reject(reason: string) {
    if (this._status !== TransactionStatus.PENDING) {
      throw new Error("Only pending tx can be rejected");
    }
    this._status = TransactionStatus.REJECTED;
    this.updatedAt = new Date();
    this.description += ` | Rejected: ${reason}`;
  }
}


export enum TransactionType {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT"
}

export enum TransactionStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export enum TransactionCategory {
    PAYMENT = "PAYMENT",
    TRANSFER = "TRANSFER"
}