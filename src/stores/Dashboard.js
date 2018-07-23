import { observable, action } from "mobx";
import API from "api";

export default class Dashboard {
  rootStore = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable havvenPrice: number = 0;
  @observable havvenMarketCap: number = 0;
  @observable nUsdPrice: number = 0;
  @observable nUsdMarketCap: number = 0;

  extend(data: JSON) {
    Object.assign(this, data);
  }

  @action
  loadData() {
    this.havvenPrice = 0.25;
    this.havvenMarketCap = 26000000;
    this.nUsdPrice = 1;
    this.nUsdMarketCap = 34322443;

    // ToDo: Implement API call
    // API.get("some url").then(results => {
    //   this.havvenPrice = results.havvenPrice;
    // });
  }
}
