import { Wallet } from "../domain/Wallet";

export default interface IWalletRepository {
    getWalletByUserId(userId: string): Promise<Wallet>
    getWalletById(id: string): Promise<Wallet>
    save(wallet: Wallet): Promise<void>
    update(wallet: Wallet): Promise<void>
    delete(wallet: Wallet): Promise<void>
}