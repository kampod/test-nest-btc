
export class CreateTxDto {
  public address_from: string;
  public address_to: string;
  public amount_btc: number;

  constructor(address_from_: string, address_to_: string, amount_btc_: number) {
    this.address_from = address_from_;
    this.address_to = address_to_;
    this.amount_btc = amount_btc_;
  }
}