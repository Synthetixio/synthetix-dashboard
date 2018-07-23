import Dashboard from "stores/Dashboard";

export default class RootStore {
  dashboard: Dashboard = null;

  constructor() {
    this.dashboard = new Dashboard(this);
  }
}
