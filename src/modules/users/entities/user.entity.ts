import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import Email from "./vo/email.object";
import { WalletEntity } from "src/modules/wallets/entities/wallet.entity";
import User from "./user.domain";

@Entity({ name: "user" })
export class UserEntity {
    @PrimaryColumn("uuid")
    id: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar", unique: true, 
        transformer: {
            to: (email: Email) => email.toString(),
            from: (email: string) => new Email(email),
        }
    })
    email: string;

    @Column({ type: "varchar" })
    password: string;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @Column({ default: false })
    removed: boolean;

    @OneToMany(() => WalletEntity, (wallet) => wallet.user, { lazy: true })
    wallets: Promise<WalletEntity[]>

    toDomain(): User {
        return new User({
            id: this.id,
            name: this.name,
            email: new Email(this.email),
            password: this.password,
            createdAt: this.createdAt,
            removed: this.removed,
        });
    }

    static fromDomain(user: User): UserEntity {
        const entity = new UserEntity();
        entity.id = user.id;
        entity.name = user.name;
        entity.email = user.email.toString();
        entity.password = user.password(false);
        entity.createdAt = user.createdAt;
        entity.removed = !user.isActive();
        return entity;
    }
}
