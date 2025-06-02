import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletsModule } from './modules/wallets/wallets.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [WalletsModule, TransactionsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
