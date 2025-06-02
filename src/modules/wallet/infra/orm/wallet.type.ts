import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Wallet, WalletType } from "../../domain/Wallet";

export default class WalletORM {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'integer', default: 0 })
    balance: number;

    @Column({ length: 255 })
    ownerId: string;

    @Column({ enum: WalletType, default: WalletType.CHECKING })
    type: WalletType;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date

    toDomain(): Wallet {
        return new Wallet(this.id, this.ownerId, this.type, this.balance, this.createdAt, this.updatedAt);
    }
}