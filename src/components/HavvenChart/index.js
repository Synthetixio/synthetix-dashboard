import React from "react";
import { observer, inject } from "mobx-react";
import Dashboard from "stores/Dashboard";
import styles from "./styles";

@inject("dashboard")
@observer
export default class HavvenChart extends React.Component {
  propTypes: {
    dashboard?: Dashboard
  };

  render() {
    const dashboard: Dashboard = this.props.dashboard;
    return <div className={styles.container}>Havven Chart</div>;
  }
}
