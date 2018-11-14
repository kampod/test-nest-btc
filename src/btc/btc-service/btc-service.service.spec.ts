import { Test, TestingModule } from '@nestjs/testing';
import { BtcServiceService } from './btc-service.service';
import { GetUtxoDto } from '../GetUtxoDto';
import { CreateTxDto } from '../CreateTxDto';

class Mock_BtcServiceService extends BtcServiceService {
  private request_utxo = {
    '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY': [
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          '53758d450e2ac65d86a24466f8013d60fb72bc21f77aa4a5b2b195094ce7294c',
        vout: 4,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01777045,
        satoshis: 1777045,
        height: 549260,
        confirmations: 670,
      },
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          'a0ea07a933423f217b8197e32be8915970fd526c942296d4ce2f79edf045d7b8',
        vout: 0,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01767378,
        satoshis: 1767378,
        height: 547808,
        confirmations: 2122,
      },
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          '270563ebf269e41a7da15883e3b6708e2bb53d953a3e878cf6e569c5f9f49a2d',
        vout: 0,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01047801,
        satoshis: 1047801,
        height: 546865,
        confirmations: 3065,
      },
    ],
    '15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25': [
      {
        address: '15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25',
        txid:
          '53758d450e2ac65d86a24466f8013d60fb72bc21f77aa4a5b2b195094ce7294c',
        vout: 4,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 2.01777045,
        satoshis: 201777045,
        height: 549260,
        confirmations: 670,
      },
      {
        address: '15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25',
        txid:
          'a0ea07a933423f217b8197e32be8915970fd526c942296d4ce2f79edf045d7b8',
        vout: 0,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 1.1767378,
        satoshis: 117673780,
        height: 547808,
        confirmations: 2122,
      },
    ],
    '1Nh7uHdvY6fNwtQtM1G5EZAFPLC33B59r1': [],
  };

  async get_utxo_by_address(address: string) {
    let list_utxo: any[] = [];
    let error = '';

    if (address && address in this.request_utxo) {
      try {
        list_utxo = this.request_utxo[address];
        if (list_utxo) {
          list_utxo = list_utxo.sort(function(obj1, obj2) {
            return obj2.amount - obj1.amount;
          });
        }
      }
      catch (e) {
        list_utxo = [];
        error = e;
      }
    }
    else {
      error = 'Bad request params';
    }

    let res = {
      list_utxo,
      error,
    };

    return res;
  }
}

describe('BtcServiceService', () => {
  let service: Mock_BtcServiceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Mock_BtcServiceService],
    }).compile();
    service = module.get<Mock_BtcServiceService>(Mock_BtcServiceService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // get_tx_size for several next_inputs
  it('get_tx_size for several next_inputs', () => {
    expect(service.get_tx_size(0)).toBe(225);
    expect(service.get_tx_size(7)).toBe(1254);
  });

  // calculate_tx_fee for several tx_sizes
  it('calculate_tx_fee for several tx_sizes', () => {
    expect(service.calculate_tx_fee(200)).toBe(0.000034);
    expect(service.calculate_tx_fee(5000)).toBe(0.00085);
  });

  // get_tx_fee for several next_inputs
  it('get_tx_fee for several next_inputs', () => {
    expect(service.get_tx_fee(0)).toBe(0.00003825);
    expect(service.get_tx_fee(15)).toBe(0.0004131);
  });

  // get_list_optimal_utxo for sorted_list_utxo1
  it('get_list_optimal_utxo for sorted_list_utxo1', () => {
    const sorted_list_utxo1 = [
      {
        amount: 1,
      },
      {
        amount: 0.5,
      },
      {
        amount: 0.5,
      },
      {
        amount: 0.4,
      },
      {
        amount: 0.1,
      },
    ];
    const expect_result1 = [
      {
        amount: 1,
      },
    ];
    expect(service.get_list_optimal_utxo(sorted_list_utxo1, 0.5)).toEqual(expect_result1);
    const sorted_list_utxo2 = [
      {
        amount: 0.5,
      },
      {
        amount: 0.4,
      },
      {
        amount: 0.3,
      },
      {
        amount: 0.2,
      },
      {
        amount: 0.1,
      },
      {
        amount: 0.04,
      },
      {
        amount: 0.03,
      },
    ];
    const expect_result2 = [
      {
        amount: 0.5,
      },
      {
        amount: 0.1,
      },
    ];
    expect(service.get_list_optimal_utxo(sorted_list_utxo2, 0.55)).toEqual(expect_result2);
    const sorted_list_utxo3 = [
      {
        amount: 0.5,
      },
      {
        amount: 0.4,
      },
      {
        amount: 0.3,
      },
      {
        amount: 0.2,
      },
      {
        amount: 0.1,
      },
      {
        amount: 0.04,
      },
      {
        amount: 0.03,
      },
    ];
    const expect_result3 = [
      {
        amount: 0.3,
      },
    ];
    expect(service.get_list_optimal_utxo(sorted_list_utxo3, 0.25)).toEqual(expect_result3);
  });

  // get_utxo_by_address
  it('get_utxo_by_address', async  () => {
    expect(service.get_utxo_by_address('address')).toBeDefined();
    const list_utxo1: any[] = [];
    const error1 = 'Bad request params';
    const res1 = {
      list_utxo: list_utxo1,
      error: error1,
    };
    expect(await service.get_utxo_by_address('')).toEqual(res1);
    const list_utxo2: any[] = [];
    const error2 = 'Bad request params';
    const res2 = {
      list_utxo: list_utxo2,
      error: error2,
    };
    expect(await service.get_utxo_by_address('abc')).toEqual(res2);
    const list_utxo3: any[] = [
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          '53758d450e2ac65d86a24466f8013d60fb72bc21f77aa4a5b2b195094ce7294c',
        vout: 4,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01777045,
        satoshis: 1777045,
        height: 549260,
        confirmations: 670,
      },
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          'a0ea07a933423f217b8197e32be8915970fd526c942296d4ce2f79edf045d7b8',
        vout: 0,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01767378,
        satoshis: 1767378,
        height: 547808,
        confirmations: 2122,
      },
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          '270563ebf269e41a7da15883e3b6708e2bb53d953a3e878cf6e569c5f9f49a2d',
        vout: 0,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01047801,
        satoshis: 1047801,
        height: 546865,
        confirmations: 3065,
      },
    ];
    const error3 = '';
    const res3 = {
      list_utxo: list_utxo3,
      error: error3,
    };
    expect(await service.get_utxo_by_address('1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY')).toEqual(res3);
  });

  // get_utxo
  it('get_utxo', async  () => {
    expect(service.get_utxo(new GetUtxoDto(''))).toBeDefined();
    const address1 = '';
    const list_utxo1: any[] = [];
    const error1 = 'Bad request params';
    const res1 = {
      result: list_utxo1,
      error: error1,
    };
    const UtxoDto1 = new GetUtxoDto(address1);
    expect(await service.get_utxo(UtxoDto1)).toEqual(res1);
    const address2 = '';
    const list_utxo2: any[] = [];
    const error2 = 'Bad request params';
    const res2 = {
      result: list_utxo2,
      error: error2,
    };
    const UtxoDto2 = new GetUtxoDto(address2);
    expect(await service.get_utxo(UtxoDto2)).toEqual(res2);
    const address3 = '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY';
    const list_utxo3: any[] = [
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          '53758d450e2ac65d86a24466f8013d60fb72bc21f77aa4a5b2b195094ce7294c',
        vout: 4,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01777045,
        satoshis: 1777045,
        height: 549260,
        confirmations: 670,
      },
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          'a0ea07a933423f217b8197e32be8915970fd526c942296d4ce2f79edf045d7b8',
        vout: 0,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01767378,
        satoshis: 1767378,
        height: 547808,
        confirmations: 2122,
      },
      {
        address: '1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY',
        txid:
          '270563ebf269e41a7da15883e3b6708e2bb53d953a3e878cf6e569c5f9f49a2d',
        vout: 0,
        scriptPubKey: '76a914a26bf4c77f2409112c7a679f0bc94f91a394f3db88ac',
        amount: 0.01047801,
        satoshis: 1047801,
        height: 546865,
        confirmations: 3065,
      },
    ];
    const error3 = '';
    const res3 = {
      result: list_utxo3,
      error: error3,
    };
    const UtxoDto3 = new GetUtxoDto(address3);
    expect(await service.get_utxo(UtxoDto3)).toEqual(res3);
  });

  // create_tx
  it('create_tx', async  () => {
    const TxDto1 = new CreateTxDto('', '', 0);
    expect(service.create_tx(TxDto1)).toBeDefined();
    const TxDto2 = new CreateTxDto('', '', 0);
    const res2 = {
      error: 'Bad request params',
      result: {
        amout_in: 0,
        amout_out: 0,
        fee: 0,
        number_utxo_use: 0,
        raw_tx: '',
      },
    };
    expect(await service.create_tx(TxDto2)).toEqual(res2);
    const TxDto3 = new CreateTxDto('1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY', '15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25', 5.0);
    const res3 = {
      error: 'Not enough utxo',
      result: {
        amout_in: 0,
        amout_out: 0,
        fee: 0,
        number_utxo_use: 0,
        raw_tx: '',
      },
    };
    expect(await service.create_tx(TxDto3)).toEqual(res3);
    const TxDto4 = new CreateTxDto('1Fooo19w8LN2pTpGzPu5hxgmbHzYr6C1KY', '15aQe4XKmXr4kPtb9UMTKceem7mNnLKD25', 0.01);
    const res4 = {
      error: '',
      result: {
        amout_in: 0.01047801,
        amout_out: 0.01043976,
        fee: 0.00003825,
        number_utxo_use: 1,
        raw_tx: '02000000012d9af4f9c569e5f68c873e3a953db52b8e70b6e38358a17d1ae469f2eb6305270000000000ffffffff0240420f000000000022313561516534584b6d5872346b50746239554d544b6365656d376d4e6e4c4b443235c8ab0000000000002231466f6f6f313977384c4e32705470477a5075356878676d62487a59723643314b5900000000',
      },
    };
    expect(await service.create_tx(TxDto4)).toEqual(res4);
  });
});
