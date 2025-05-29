import { Repository } from "typeorm";
import { Wallet } from "../../entities/wallet.entity";
import IWalletRepository from "./walletRepository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async getWalletByUserId(userId: string): Promise<Wallet> {
    return this.walletRepository.findOneOrFail({ where: { userId } });
  }

  async getWalletById(id: string): Promise<Wallet> {
    return this.walletRepository.findOneOrFail({ where: { id } });
  }

  async save(wallet: Wallet): Promise<void> {
    await this.walletRepository.save(wallet);
  }

  async update(wallet: Wallet): Promise<void> {
    await this.walletRepository.update(wallet.id, wallet);
  }

  async delete(wallet: Wallet): Promise<void> {
    await this.walletRepository.delete(wallet.id);
  }
}
