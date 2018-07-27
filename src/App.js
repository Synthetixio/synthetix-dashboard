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
        <div className="container is-fluid">
          <div className={cx("is-hidden-mobile", styles.lastUpdatedBox)}>
            <label>LAST UPDATED</label> <span>52 MINS AGO</span>{" "}
          </div>
          <TopNavBar />

          <div className="columns is-multiline">
            <SingleStat
              value={13549045}
              trend={2.4}
              label="Havven Market Cap"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStat
              value={0.262}
              trend={2.8}
              label="Havven Price"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStat
              value={12026089}
              trend={-6.4}
              label="nUSD Market Cap"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStat
              value={1}
              label="nUSD Price"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
          </div>
          <div className="columns">
            <div className="column">
              <Chart
                info={charts.HavvenPrice}
                onCursorChange={this.onCursorChange} //to set main price label to value from cursor position
              />
            </div>
          </div>
          <div className="columns">
            <div className="column">Locked Havven Value</div>
            <div className="column">Locked Havven Ratio</div>
          </div>
          <div className="columns">
            <div className="column">nUSD Chart</div>
          </div>
          <div className="columns">
            <div className="column">Total Fees</div>
            <div className="column">Collateralization Ratio</div>
          </div>
        </div>
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
