import Money, { MoneyProps } from "./vo/money.object";
import WalletError from "./wallet.error";
import { randomUUID } from "crypto";

export default class Wallet {
    public readonly id: string;
    public readonly userId: string;
    private _balance: Money;
    public readonly createdAt: Date;
    private _updatedAt: Date;
    private removed: boolean;

    constructor(props: WalletPros) {
        this.id = props.id;
        this.userId = props.userId;
        this._balance = new Money(props.balance);
        this.createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this.removed = props.removed
    }

    static create(props: CreateWalletProps) {
        return new Wallet({
            id: randomUUID(),
            userId: props.userId,
            balance: props.balance,
            createdAt: new Date(),
            updatedAt: new Date(),
            removed: false
        });
    }
    
    get balance(): Money {
        return this._balance;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    withdraw(amount: Money): void {
        if (this._balance.lessThan(amount)) throw WalletError.insufficientBalance(this.id, this.balance, amount);
        
        this._balance = this._balance.subtract(amount);
        this._updatedAt = new Date();
    }

    deposit(amount: Money): void {
        this._balance = this._balance.add(amount);
        this._updatedAt = new Date();
    }

    isActive(): boolean {
        return !this.removed
    }

    remove(): void {
        if (!this.isActive()) throw WalletError.alreadyRemoved(this.id);
        if (this.balance.amount > 0) throw WalletError.hasBalance(this.id, this.balance);
        
        this.removed = true;
        this._updatedAt = new Date();
    }

    restore(): void {
        if (this.isActive()) throw WalletError.alreadyActive(this.id);
        
        this.removed = false;
        this._updatedAt = new Date();
    }
}

export interface WalletPros {
    id: string;
    userId: string;
    balance: MoneyProps;
    createdAt: Date;
    updatedAt: Date;
    removed: boolean
}

export interface CreateWalletProps {
    userId: string;
    balance: MoneyProps
}