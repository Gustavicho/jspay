import { Injectable } from '@nestjs/common';
import { Wallet, WalletType } from './domain/Wallet';
import IWalletRepository from './infra/WalletRepository.interface';

@Injectable()
export class WalletService {
    constructor(
        private readonly walletRepository: IWalletRepository,
    ) {
    }

    async findWallet(walletId: string): Promise<Wallet> {
        const wallet = await this.walletRepository.getWalletById(walletId);
        if (!wallet)  throw new Error('Wallet not found');

        return wallet;
    }

    async createWallet(userId: string, type: WalletType): Promise<void> {
        this.walletRepository.save(Wallet.create(userId, type, this.generateId));
    }

    async transfer(fromWalletId: string, toWalletId: string, amount: number): Promise<void> {
        const fromWalletPromise = this.findWallet(fromWalletId);
        const toWalletPromise = this.findWallet(toWalletId);
        const [fromWallet, toWallet] = await Promise.all([fromWalletPromise, toWalletPromise]);

        fromWallet.withdraw(amount);
        toWallet.deposit(amount);

        Promise.all([
            this.walletRepository.save(fromWallet),
            this.walletRepository.save(toWallet),
        ])
    }

    async deposit(walletId: string, amount: number): Promise<void> {
        const wallet = await this.findWallet(walletId);
        wallet.deposit(amount);
        await this.walletRepository.save(wallet);
    }

    async withdraw(walletId: string, amount: number): Promise<void> {
        const wallet = await this.findWallet(walletId);
        wallet.withdraw(amount);
        await this.walletRepository.save(wallet);
    }

    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // eslint-disable-next-line no-bitwise
            const r = (Math.random() * 16) | 0;
            // eslint-disable-next-line no-bitwise, no-mixed-operators
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

