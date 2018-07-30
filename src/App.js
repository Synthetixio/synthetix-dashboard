import React from "react";
import Chart from "components/Chart";
import { connect } from "react-redux";
import { fetchCharts } from "./actions/charts";
import SingleStat from "components/SingleStat";
import TopNavBar from "components/TopNavBar";
import { switchTheme } from "actions/theme";
import { cx } from "emotion";
import moment from "moment";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activeSection: "stats",
    themeCss: ""
  };

  componentDidMount() {
    this.props.fetchCharts();
    this.switchTheme();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.theme !== this.props.theme) {
      this.switchTheme();
    }
  }

  switchTheme() {
    if (this.props.theme === "dark") {
      import(`styling/dark.css`).then(res => {
        this.setState({ themeCss: res[0][1] });
      });
    } else {
      import(`styling/light.css`).then(res => {
        this.setState({ themeCss: res[0][1] });
      });
    }
  }

  onCursorChange = () => {};

  render() {
    const { charts, theme } = this.props;
    const { activeSection, themeCss } = this.state;
    const { stats, lastUpdated } = charts;

    const minsAgo = moment(Date.now()).diff(lastUpdated, "minutes");

    return (
      <div className="dashboard-root">
        <style>{themeCss}</style>
        <div className="is-hidden-mobile last-updated-top">
          <label>LAST UPDATED</label> <span>{minsAgo} MINS AGO</span>{" "}
        </div>
        <TopNavBar selectedSection={activeSection} />
        <div className="container main-content">
          <div className="columns is-multiline" id="stats">
            <SingleStat
              value={stats.havvenMarketCapUsd}
              trend={stats.havvenMarketCapUsd24hDelta * 100}
              label="HAVVEN MARKET CAP"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStat
              value={stats.havvenPriceCapUsd}
              trend={stats.havvenPriceCapUsd24hDelta * 100}
              label="HAVVEN PRICE"
              desc="Price of Havven multipled by it’s curiculating supply."
              decimals={3}
            />
            <SingleStat
              value={stats.nominMarketCapUsd}
              trend={stats.nominMarketCapUsd24hDelta * 100}
              label="nUSD MARKET CAP"
              desc="Price of Havven multipled by it’s curiculating supply."
            />
            <SingleStat
              value={stats.nominPriceCapUsd}
              trend={stats.nominPriceCapUsd24hDelta * 100}
              label="nUSD PRICE"
              desc="Price of Havven multipled by it’s curiculating supply."
              decimals={3}
            />
          </div>
        </div>
        <div className="container" id="hav">
          <div>
            <div className="level">
              <div className="level-left">
                <div className="level-item title">
                  <h2>HAV</h2>
                  <span>(HAVVEN)</span>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button className="button is-link">Market Cap</button>
                </div>
                <div className="level-item">
                  <button className="button is-link is-active">Price</button>
                </div>
                <div className="level-item">
                  <button className="button is-link">Volume</button>
                </div>
              </div>
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
        <div className="container" id="nusd">
          <div>
            <div className="level">
              <div className="level-left">
                <div className="level-item title">
                  <h2>nUSD</h2>
                  <span>(NOMINS)</span>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button className="button is-link">Market Cap</button>
                </div>
                <div className="level-item">
                  <button className="button is-link is-active">Price</button>
                </div>
                <div className="level-item">
                  <button className="button is-link">Volume</button>
                </div>
              </div>
            </div>

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
          </div>
        </div>
        <div className="container main-content">
          <div className="columns">
            <div className="column">
              <div className="footer-info">
                <div className="last-updated-bottom">
                  <label>LAST UPDATED</label> <span>{minsAgo} MINS AGO</span>
                </div>
                <div
                  className={cx("theme-switcher", theme)}
                  onClick={() =>
                    this.props.switchTheme(theme === "dark" ? "light" : "dark")
                  }
                >
                  <label>{theme}</label>
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
  const { charts, theme } = state;

  return {
    charts,
    theme: theme.theme
  };
};

const ConnectedApp = connect(mapStateToProps, { switchTheme, fetchCharts })(
  App
);
export default ConnectedApp;
