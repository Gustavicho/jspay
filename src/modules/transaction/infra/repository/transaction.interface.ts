import Transaction from "../../domain/Transaction";

export default interface ITransactionRepository {
    findAll(): Promise<Transaction[]>;
    findById(id: string): Promise<Transaction | null>;
    findByReceiverId(receiverId: string): Promise<Transaction[]>;
    findBySenderId(senderId: string): Promise<Transaction[]>;
    save(transaction: Transaction): Promise<void>;
    update(transaction: Transaction): Promise<void>;
    delete(transaction: Transaction): Promise<void>;
}