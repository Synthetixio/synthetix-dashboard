import React from "react";
import { Col, Container, Row } from "react-grid-system";
import Chart from "components/Chart";
import { connect } from "react-redux";
import { fetchCharts } from "./actions/charts";
import PropTypes from "prop-types";
import styles from "./styles";
import SingleStat from "components/SingleStat";
import TopNavBar from "components/TopNavBar";
import { cx } from "emotion";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(fetchCharts());
  }

  onCursorChange = () => {};

  render() {
    const { charts } = this.props;

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
              <div>
                <Chart
                  info={charts.HavvenPrice}
                  onCursorChange={this.onCursorChange} //to set main price label to value from cursor position
                />
              </div>
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

const mapStateToProps = state => {
  const { charts } = state;

  return {
    charts
  };
};

const ConnectedApp = connect(mapStateToProps)(App);
export default ConnectedApp;
