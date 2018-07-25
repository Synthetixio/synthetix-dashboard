import React from "react";
import { observer, inject } from "mobx-react";
import { Col, Container, Row } from "react-grid-system";
import Dashboard from "./stores/Dashboard";
import HavvenChart from "components/HavvenChart";
import styles from "./styles";

@inject("dashboard")
@observer
export default class App extends React.Component {
  propTypes: {
    dashboard: Dashboard
  };

  render() {
    const dashboard: Dashboard = this.props.dashboard;
    return (
      <div className={styles.root}>
        <Container>
          <Row>
            <Col>Havven Market Cap</Col>
            <Col>Havven Price</Col>
            <Col>nUSD Market Cap</Col>
            <Col>nUSD Price</Col>
          </Row>
          <Row>
            <Col>
              <HavvenChart />
            </Col>
          </Row>
          <Row>
            <Col>Locked Havven Value</Col>
            <Col>Locked Havven Ratio</Col>
          </Row>
          <Row>
            <Col>nUSD Chart</Col>
          </Row>
          <Row>
            <Col>Total Fees</Col>
            <Col>Collateralization Ratio</Col>
          </Row>
        </Container>
      </div>
    );
  }
}
