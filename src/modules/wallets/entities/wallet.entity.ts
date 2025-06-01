import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Money, { MoneyCurrency } from "./vo/money.object";
import Wallet from "./wallet.domain";
import { UserEntity } from "src/modules/users/entities/user.entity";

@Entity({ name: "wallets" })
export class WalletEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @JoinColumn({ name: "user_id" })
  @ManyToOne(() => UserEntity, (user) => user.wallets, { lazy: true })
  user: Promise<UserEntity>;

  @Column({
    type: "int",
    default: 0,
    transformer: {
      to: (value: Money) => (value instanceof Money ? value.amountInCents : 0),
      from: (cents: number) => new Money(cents / 100, MoneyCurrency.USD),
    },
  })
  balance: Money;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @Column({ default: false })
  removed: boolean;

  toDomain(): Wallet {
    return new Wallet({
      id: this.id,
      userId: this.userId,
      balance: this.balance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      removed: this.removed,
    });
  }

  static fromDomain(wallet: Wallet): WalletEntity {
    const entity = new WalletEntity();
    entity.id = wallet.id;
    entity.userId = wallet.userId;
    entity.balance = wallet.balance;
    entity.createdAt = wallet.createdAt;
    entity.updatedAt = wallet.updatedAt;
    entity.removed = !wallet.isActive();
    return entity;
  }
}
