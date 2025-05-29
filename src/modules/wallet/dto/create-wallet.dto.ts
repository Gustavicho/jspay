import { IsIn, IsUUID } from "class-validator";
import { WalletType } from "../entities/wallet.entity";

export class CreateWalletDto {
    @IsUUID()
    readonly userId: string;

    @IsIn([WalletType.CHECKING, WalletType.SAVINGS])
    readonly walletType: WalletType;
}
