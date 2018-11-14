import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BtcController } from './btc/btc.controller';
import { BtcServiceService } from './btc/btc-service/btc-service.service';

@Module({
  imports: [],
  controllers: [AppController, BtcController],
  providers: [AppService, BtcServiceService],
})
export class AppModule {}
