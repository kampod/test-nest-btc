import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { BtcServiceService } from './btc-service/btc-service.service';
import { GetUtxoDto } from './GetUtxoDto';
import { CreateTxDto } from './CreateTxDto';

@Controller('btc')
export class BtcController {
  private btc_service = new BtcServiceService;

  @Post('create_tx')
  @HttpCode(200)
  create_tx(@Body() CreateTxDto: CreateTxDto) {
    return this.btc_service.create_tx(CreateTxDto);
  }

  @Get('get_utxo')
  @HttpCode(200)
  get_utxo(@Body() GetUtxoDto: GetUtxoDto) {
    return this.btc_service.get_utxo(GetUtxoDto);
  }

  @Get('get_hello')
  @HttpCode(200)
  get_hello(){
    return 'Hello';
  }
}
