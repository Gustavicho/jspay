import { IsNumber, IsUUID } from "class-validator";

export class transferDto {
    @IsUUID()
    toWalletId: string;

    @IsNumber({ allowInfinity: false, allowNaN: false })
    amount: number;
}
