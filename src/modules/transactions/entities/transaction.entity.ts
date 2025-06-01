import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { TransactionStatus, TransactionType } from "./transaction.domain";

@Entity({name: "transaction"})
export class TransactionEntity {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ name: "sender_id", type: "uuid" })
    senderId: string;

    @Column({ name: "receiver_id", type: "uuid", nullable: true })
    receiverId?: string;

    @Column({ type: "enum", enum: TransactionType, default: TransactionType.DEPOSIT })
    type: TransactionType;

    @Column({ type: "enum", enum: TransactionStatus, default: TransactionStatus.PENDING })
    status: TransactionStatus;

    @Column({ type: "int", default: 0 })
    amountInCents: number;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;

    @Column({ default: false })
    removed: boolean;
}
