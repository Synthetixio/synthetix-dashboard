import { observable, action, IObservableArray } from "mobx";
import API from "api";
import DataItem from "stores/DataItem";

export default class Dashboard {
  rootStore = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable isLoading: boolean = false;
  @observable havvenPrice: IObservableArray<DataItem> = [];
  @observable havvenMarketCap: IObservableArray<DataItem> = [];
  @observable nUsdPrice: IObservableArray<DataItem> = [];
  @observable nUsdMarketCap: IObservableArray<DataItem> = [];

  extend(data: JSON) {
    Object.assign(this, data);
  }

  @action
  loadData() {
    this.isLoading = true;
    API.get("/dataPoint/chartData")
      .then(results => {
        this.havvenPrice = results.HavvenPrice.data;
        this.havvenMarketCap = results.HavvenMarketCap.data;
        this.nUsdPrice = results.NominPrice.data;
        this.nUsdMarketCap = results.NominMarketCap.data;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
