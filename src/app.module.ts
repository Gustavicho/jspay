import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransaaactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [WalletModule, TransaaactionModule, UserModule, AuthModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get('DATABASE_HOST'),
        port: +cs.get('DATABASE_PORT'),
        username: cs.get('DATABASE_USER'),
        password: cs.get('DATABASE_PASSWORD'),
        database: cs.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: cs.get('ENV') === 'dev',
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
