import { Injectable } from '@nestjs/common';
import Transaction, {
  TransactionCategory,
  TransactionType,
} from './domain/Transaction';
import ITransactionRepository from './infra/repository/transaction.interface';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async create(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    type: TransactionType,
    category: TransactionCategory,
    description: string,
  ): Promise<Transaction> {
    const transaction = Transaction.create(
      fromWalletId,
      toWalletId,
      amount,
      type,
      category,
      description,
      this.generateId,
    );

    await this.transactionRepository.save(transaction);

    return transaction;
  }

  async approve(transactionId: string): Promise<void> {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.approve();

    await this.transactionRepository.save(transaction);
  }

  async reject(transactionId: string, reason: string): Promise<void> {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.reject(reason);

    await this.transactionRepository.save(transaction);
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
