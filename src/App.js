import React from "react";
import { observer, inject } from "mobx-react";
import { Col, Container, Row } from "react-grid-system";
import Dashboard from "./stores/Dashboard";
import HavvenChart from "components/HavvenChart";

@inject("dashboard")
@observer
export default class App extends React.Component {
  propTypes: {
    dashboard: Dashboard
  };

  render() {
    const dashboard: Dashboard = this.props.dashboard;
    return (
      <div>
        <Container>
          <Row>
            <Col>Havven Market Cap: {dashboard.havvenMarketCap}</Col>
            <Col>Havven Price: {dashboard.havvenPrice}</Col>
            <Col>nUSD Market Cap: {dashboard.nUsdMarketCap}</Col>
            <Col>nUSD Price: {dashboard.nUsdPrice}</Col>
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
