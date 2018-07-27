import React from "react";
import { observer, inject } from "mobx-react";
import Dashboard from "stores/Dashboard";
import styles from "./styles";
import DataItem from "stores/DataItem";
import { Col, Container, Row } from "react-grid-system";

@inject("dashboard")
@observer
export default class HavvenChart extends React.Component {
  propTypes: {
    dashboard?: Dashboard
  };

  render() {
    const dashboard: Dashboard = this.props.dashboard;
    return (
      <div className={styles.container}>
        <h1>Havven Chart</h1>
        <div>
          <button onClick={() => dashboard.loadData()}>Reload</button>
        </div>
        {dashboard.isLoading && <div>Loading...</div>}
        <div className="columns is-multiline">
          <div className="column">Test</div>
          {/*{dashboard.havvenPrice.map((el: DataItem, idx) => (*/}
          {/*<div key={idx} className="column">*/}
          {/*<div>USD Value: {el.usdValue}</div>*/}
          {/*<div>ETH Value: {el.ethValue}</div>*/}
          {/*<div>BTC Value: {el.btcValue}</div>*/}
          {/*<div>Date: {el.created}</div>*/}
          {/*</div>*/}
          {/*))}*/}
        </div>
      </div>
    );
  }
}
