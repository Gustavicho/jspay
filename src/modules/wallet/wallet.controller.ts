import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { transferDto } from './dto/transfer.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWallet(createWalletDto.userId, createWalletDto.walletType);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findWallet(id);
  }

  @Post('/:id/deposit')
  deposit(@Param('id') id: string, @Body('amount') amount: number) {
    return this.walletService.deposit(id, amount);
  }

  @Post('/:id/withdraw')
  withdraw(@Param('id') id: string, @Body('amount') amount: number) {
    return this.walletService.withdraw(id, amount);
  }

  @Post('/:Id/transfer/')
  transfer(@Param('fromWalletId') fromWalletId: string, @Body() transferDto: transferDto) {
    return this.walletService.transfer(fromWalletId, transferDto.toWalletId, transferDto.amount);
  }
}
