import React from "react";
import Chart from "components/Chart";
import { connect } from "react-redux";
import { fetchCharts } from "./actions/charts";
import SingleStat from "components/SingleStat";
import TopNavBar from "components/TopNavBar";
import { switchTheme } from "actions/theme";
import { cx } from "emotion";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activeSection: "stats"
  };

  componentDidMount() {
    this.props.fetchCharts();
    if (this.props.theme === "dark") {
      import(`styling/dark.sass`);
    } else {
      import(`styling/light.sass`);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.theme !== this.props.theme) {
      window.location.reload();
    }
  }

  onCursorChange = () => {};

  render() {
    const { charts, theme } = this.props;
    const { activeSection } = this.state;

    return (
      <div className="dashboard-root">
        <div className="is-hidden-mobile last-updated-top">
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
                <div className="level-item">Market Cap</div>
                <div className="level-item">Price</div>
                <div className="level-item">Volume</div>
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
          <div className="columns">
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
              <div className="columns">
                <div className="column">
                  <div className="footer-info">
                    <div className="last-updated-bottom">
                      <label>LAST UPDATED</label> <span>52 MINS AGO</span>
                    </div>
                    <div
                      className={cx("theme-switcher", theme)}
                      onClick={() =>
                        this.props.switchTheme(
                          theme === "dark" ? "light" : "dark"
                        )
                      }
                    >
                      <label>{theme}</label>
                    </div>
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
