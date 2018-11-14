import { Injectable } from '@nestjs/common';
import { CreateTxDto } from '../CreateTxDto';
import { GetUtxoDto } from '../GetUtxoDto';
import * as rpn from 'request-promise-native';
import bitcoin = require('bitcoinjs-lib');

@Injectable()
export class BtcServiceService {
  private DIG: number = (10 ** 8);
  private fee_per_bye: number = 17;
  private first_input: number = 225;
  private next_input: number = 147;

  get_list_optimal_utxo(list_utxo_: any[], amount_btc: number) {
    const list_utxo: any[] = list_utxo_;
    let list_optimal_utxo: any[] = [];

    if (list_utxo.length === 0)
      return list_optimal_utxo;

    let total_in = 0;
    list_utxo.forEach(function(item, i, arr) {
      total_in = total_in + item.amount;
    });
    let total_out = amount_btc + this.get_tx_fee(list_utxo.length - 1);

    if (total_in < total_out) {
      return list_optimal_utxo;
    } else if (total_in === total_out) {
      list_optimal_utxo = list_utxo;
      return list_optimal_utxo;
    }

    total_in = 0;
    while (true) {
      let index = list_utxo.length;
      while (index > 0) {
        index = index - 1;
        const total_in_check = total_in + list_utxo[index].amount;
        const total_out_check = amount_btc + this.get_tx_fee(list_optimal_utxo.length - 1 + 1);
        if (total_in_check >= total_out_check) {
          break;
        }
      }

      total_in = total_in + list_utxo[index].amount;
      list_optimal_utxo.push(list_utxo[index]);
      total_out = amount_btc + this.get_tx_fee(list_optimal_utxo.length - 1);
      list_utxo.splice(index, 1);

      if (total_in >= total_out) {
        break;
      }
    }

    return list_optimal_utxo;
  }

  get_tx_fee(next_inputs: number = 0) {
    return this.calculate_tx_fee(this.get_tx_size(next_inputs));
  }

  get_tx_size(next_inputs: number = 0) {
    return (this.first_input + next_inputs * this.next_input);
  }

  calculate_tx_fee(tx_size: number = 0) {
    return this.fee_per_bye * tx_size / this.DIG;
  }

  async get_utxo_by_address(address: string) {
    let list_utxo: any[] = [];
    let error = '';

    if (address) {
      const URL = 'https://insight.bitpay.com/api/addr/' + address + '/utxo';
      await rpn.get(URL)
        .then((body) => {
          list_utxo = JSON.parse(body);
        })
        .catch((err) => {
          error = err.toString();
        });
      list_utxo = list_utxo.sort(function(obj1, obj2) {
        return obj2.amount - obj1.amount;
      });
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

  async create_tx(CreateTxDto: CreateTxDto) {
    let fee = 0;
    let amout_in = 0;
    let amout_out = 0;
    let number_utxo_use = 0;
    let raw_tx = '';
    let error = '';

    if ((CreateTxDto.address_from) &&
      (CreateTxDto.address_to) &&
      (CreateTxDto.amount_btc) &&
      (CreateTxDto.amount_btc > 0)) {

      let list_utxo = [];
      await this.get_utxo_by_address(CreateTxDto.address_from)
        .then((value) => {
          error = value.error;
          list_utxo = value.list_utxo;
        })
        .catch((err) => {
          error = err.toString();
        });
      // console.log('\n\nlist_utxo:');
      // console.dir(list_utxo);

      const list_optimal_utxo: any[] = this.get_list_optimal_utxo(list_utxo, CreateTxDto.amount_btc);
      // console.log('\n\nlist_optimal_utxo:');
      // console.dir(list_optimal_utxo);

      if (list_optimal_utxo.length !== 0) {
        try {
          let total_in = 0;
          let total_in_satoshis = 0;
          const txb = new bitcoin.TransactionBuilder();
          list_optimal_utxo.forEach(function(item, i, arr) {
            total_in = total_in + item.amount;
            total_in_satoshis = total_in_satoshis + item.satoshis;
            txb.addInput(item.txid, item.vout);
          });
          const fee_tx = this.get_tx_fee(list_optimal_utxo.length - 1);
          const fee_tx_satoshis = fee_tx * this.DIG;
          const amount_btc = CreateTxDto.amount_btc;
          const amount_btc_satoshis = amount_btc * this.DIG;
          const diff = total_in - amount_btc - fee_tx;
          const diff_satoshis = total_in_satoshis - amount_btc_satoshis - fee_tx_satoshis;

          txb.addOutput(Buffer.from(CreateTxDto.address_to, 'utf8'), amount_btc_satoshis);
          if (diff_satoshis > 0) {
            txb.addOutput(Buffer.from(CreateTxDto.address_from, 'utf8'), diff_satoshis);
          }
          // console.log('\n\ntxb:');
          // console.dir(txb);

          const tx = txb.buildIncomplete();

          amout_in = total_in;
          amout_out = amount_btc + diff;
          fee = fee_tx;
          number_utxo_use = list_optimal_utxo.length;
          raw_tx = tx.toHex();
        }
        catch (e) {
          error = e;
        }
      } else {
        error = 'Not enough utxo';
      }
    } else {
      error = 'Bad request params';
    }

    const res = {
      amout_in,
      amout_out,
      fee,
      number_utxo_use,
      raw_tx,
    };

    const result = {
      error,
      result: res,
    };
    // console.log('\n\nresult:');
    // console.dir(result);

    return result;
  }

  async get_utxo(GetUtxoDto: GetUtxoDto) {
    let list_utxo = [];
    let error = '';

    if (GetUtxoDto.address) {
      await this.get_utxo_by_address(GetUtxoDto.address)
        .then((value) => {
          error = value.error;
          list_utxo = value.list_utxo;
        })
        .catch((err) => {
          error = err.toString();
        });
    } else {
      error = 'Bad request params';
    }

    const result_utxo = {
      error,
      result: list_utxo,
    };
    // console.log('\n\nresult_utxo:');
    // console.dir(result_utxo);

    return result_utxo;
  }
}
