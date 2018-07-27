import React, { Fragment } from "react";
import Chart from "components/Chart";
import { connect } from "react-redux";
import { fetchCharts } from "./actions/charts";
import styles from "./styles";
import SingleStat from "components/SingleStat";
import TopNavBar from "components/TopNavBar";
import { cx } from "emotion";
import VisibilitySensor from "react-visibility-sensor";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activeSection: "stats"
  };

  componentDidMount() {
    this.props.dispatch(fetchCharts());
  }

  onCursorChange = () => {};

  onVisibilityChange = (section, isVisible) => {
    if (isVisible) {
      this.setState({ activeSection: section });
      console.log(section);
    }
  };

  render() {
    const { charts } = this.props;

    return (
      <div className={styles.root}>
        <div className="container">
          <div className={cx("is-hidden-touch", styles.lastUpdatedBox)}>
            <label>LAST UPDATED</label> <span>52 MINS AGO</span>{" "}
          </div>
          <TopNavBar />

          <div className="columns is-multiline">
            <SingleStat
              value={13549045}
              trend={2.4}
              label="HAVVEN MARKET CAP"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStat
              value={0.262}
              trend={2.8}
              label="HAVVEN PRICE"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStat
              value={12026089}
              trend={-6.4}
              label="nUSD MARKET CAP"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStat
              value={1}
              label="nUSD PRICE"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
          </div>
          <div className="columns">
            <div className="column">
              <Chart
                info={charts.HavvenPrice}
                onCursorChange={this.onCursorChange}
                fullSize={true}
              />
            </div>
          </div>
          <div className="columns">
            {/*<div className="column">Locked Havven Value</div> */}
            <div className="column">
              <Chart
                info={charts.LockedUpHavven}
                onCursorChange={this.onCursorChange}
                colorGradient="yellow"
              />
            </div>
            {/*<div className="column">Locked Havven Ratio</div>*/}
            <div className="column">
              <Chart
                info={charts.HavvenPrice}
                onCursorChange={this.onCursorChange}
                colorGradient="red"
              />
            </div>
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
