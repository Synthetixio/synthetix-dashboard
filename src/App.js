import React, { Fragment } from "react";
import Chart from "components/Chart";
import { connect } from "react-redux";
import { fetchCharts } from "./actions/charts";
import styles from "./styles";
import SingleStat from "components/SingleStat";
import TopNavBar from "components/TopNavBar";
import { cx } from "emotion";
import { Element } from "react-scroll";

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

  render() {
    const { charts } = this.props;
    const { activeSection } = this.state;

    return (
      <div className={styles.root}>
        <div className={cx("is-hidden-mobile", styles.lastUpdatedBox)}>
          <label>LAST UPDATED</label> <span>52 MINS AGO</span>{" "}
        </div>
        <TopNavBar selectedSection={activeSection} />
        <div className="container main-content">
          <div className="columns is-multiline" id="stats">
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
          <div className="columns" id="hav">
            <div className="column">
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
                <div className="column">
                  <Chart
                    info={charts.LockedUpHavven}
                    onCursorChange={this.onCursorChange}
                    colorGradient="yellow"
                  />
                </div>
                <div className="column">
                  <Chart
                    info={charts.HavvenPrice}
                    onCursorChange={this.onCursorChange}
                    colorGradient="red"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="columns" id="nusd">
            <div className="column">
              <div className="columns">
                <div className="column">
                  <Chart
                    info={charts.NominPrice}
                    onCursorChange={this.onCursorChange}
                    fullSize={true}
                  />
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <Chart
                    info={charts.NominFeesCollected}
                    onCursorChange={this.onCursorChange}
                    colorGradient="green"
                  />
                </div>
                <div className="column">
                  <Chart
                    info={charts.CollateralizationRatio}
                    onCursorChange={this.onCursorChange}
                    colorGradient="red"
                  />
                </div>
              </div>
              <div className="columns footer-info">
                <div className="column">
                  <div className="last-updated">
                    <label>LAST UPDATED</label> <span>52 MINS AGO</span>
                  </div>
                  <div className="theme-switcher">
                    <label>Dark</label>
                  </div>
                </div>
              </div>
            </div>
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
