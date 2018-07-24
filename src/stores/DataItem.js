export default class DataItem {
  usdValue: ?number;
  btcValue: ?number;
  ethValue: ?number;
  createdUnix: string;
  created: string;

  constructor(data: JSON) {
    Object.assign(this, data);
  }
}
