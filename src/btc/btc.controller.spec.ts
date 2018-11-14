import { Test, TestingModule } from '@nestjs/testing';
import { BtcController } from './btc.controller';
import { CreateTxDto } from './CreateTxDto';
import { GetUtxoDto } from './GetUtxoDto';

describe('Btc Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [BtcController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: BtcController = module.get<BtcController>(BtcController);
    expect(controller).toBeDefined();
  });
  it('get_hello', () => {
    const controller: BtcController = module.get<BtcController>(BtcController);
    expect(controller.get_hello()).toBe('Hello');
  });
  it('get_utxo', async () => {
    const controller: BtcController = module.get<BtcController>(BtcController);
    const UtxoDto1 = new GetUtxoDto('');
    const list_utxo1: any[] = [];
    const error1 = 'Bad request params';
    const res1 = {
      result: list_utxo1,
      error: error1,
    };
    expect(await controller.get_utxo(UtxoDto1)).toEqual(res1);
  });
  it('create_tx', async () => {
    const controller: BtcController = module.get<BtcController>(BtcController);
    const TxDto1 = new CreateTxDto('', '', 0);
    const res1 = {
      error: 'Bad request params',
      result: {
        amout_in: 0,
        amout_out: 0,
        fee: 0,
        number_utxo_use: 0,
        raw_tx: '',
      },
    };
    expect(await controller.create_tx(TxDto1)).toEqual(res1);
  });
});
