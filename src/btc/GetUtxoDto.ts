
export class GetUtxoDto {
  public address: string;

  constructor(address_: string) {
    this.address = address_;
  }
}