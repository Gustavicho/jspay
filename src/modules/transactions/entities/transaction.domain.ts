import { randomUUID } from "crypto";
import Money, { MoneyProps } from "src/modules/wallets/entities/vo/money.object";
import TransactionError from "./transaction.error";

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  TRANSFER = "transfer",
}

export enum TransactionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface TransactionProps {
  id: string;
  senderId: string;
  receiverId?: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  amount: Money;
}

export interface CreateTransactionProps {
  senderId: string;
  receiverId?: string;
  type: TransactionType;
  amount: MoneyProps;
}

export default class Transaction {
  public readonly id: string;
  public readonly senderId: string;
  public readonly receiverId?: string;
  public readonly type: TransactionType;

  private _status: TransactionStatus;
  public readonly createdAt: Date;
  private _updatedAt: Date;
  private _amount: Money;

  public constructor(props: TransactionProps) {
    this.id = props.id;
    this.senderId = props.senderId;
    this.receiverId = props.receiverId;
    this.type = props.type;
    this._status = props.status;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    const zeroMoney = Money.zero(props.amount.currency);
    if (!props.amount.greaterThan(zeroMoney)) {
      throw TransactionError.invalidAmount();
    }
    this._amount = props.amount;

    if (
      this.type === TransactionType.TRANSFER &&
      this.senderId === this.receiverId
    ) {
      throw TransactionError.sameSenderReceiver();
    }
  }

  public static create(props: CreateTransactionProps): Transaction {
    if (!Object.values(TransactionType).includes(props.type)) {
      throw TransactionError.invalidType(props.type);
    }

    const now = new Date();
    return new Transaction({
      id: randomUUID(),
      senderId: props.senderId,
      receiverId: props.receiverId,
      type: props.type,
      status: TransactionStatus.PENDING,
      amount: new Money(props.amount),
      createdAt: now,
      updatedAt: now,
    });
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get amount(): Money {
    return this._amount;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public approve(): this {
    if (this._status !== TransactionStatus.PENDING) {
      throw TransactionError.invalidStatusTransition(
        this._status,
        TransactionStatus.APPROVED
      );
    }

    this._status = TransactionStatus.APPROVED;
    this._touch();
    return this;
  }

  public reject(): this {
    if (this._status !== TransactionStatus.PENDING) {
      throw TransactionError.invalidStatusTransition(
        this._status,
        TransactionStatus.REJECTED
      );
    }

    this._status = TransactionStatus.REJECTED;
    this._touch();
    return this;
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
