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
        <Container>
          <Row>
            {dashboard.havvenPrice.map((el: DataItem, idx) => (
              <Col sm={2} key={idx} className={styles.box}>
                <div>USD Value: {el.usdValue}</div>
                <div>ETH Value: {el.ethValue}</div>
                <div>BTC Value: {el.btcValue}</div>
                <div>Date: {el.created}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }
}
