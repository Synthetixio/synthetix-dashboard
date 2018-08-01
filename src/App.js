import React from "react";
import Chart from "components/Chart";
import { connect } from "react-redux";
import { fetchCharts } from "./actions/charts";
import SingleStat from "components/SingleStat";
import TopNavBar from "components/TopNavBar";
import { switchTheme } from "actions/theme";
import { cx } from "emotion";
import moment from "moment";
const HAV_CHART = { HavvenPrice: "HavvenPrice", HavvenMarketCap: "HavvenMarketCap", HavvenVolume24h: "HavvenVolume24h", LockedUpHavven: "LockedUpHavven" };
const nUSD_CHART = { NominPrice: "NominPrice",  NominMarketCap: "NominMarketCap", NominVolume24h: "NominVolume24h", NominFeesCollected: "NominFeesCollected", CollateralizationRatio: "CollateralizationRatio"};
const DECIMALS = {
  HavvenMarketCap : { Val: 0, Btc: 0 },
  HavvenPrice : { Val: 3, Btc: 4 },
  HavvenVolume24h : { Val: 0, Btc: 0 },
  LockedUpHavven:{ Val: 2 },
  HavvenVolume24h:{ Val: 0 },
  NominMarketCap:{ Val: 2 },
  NominPrice:{ Val: 4 },
  NominVolume24h:{ Val: 2 },
  NominFeesCollected: { Val: 2 },
  CollateralizationRatio: { Val: 2 },//%
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activeSection: "stats",
    themeCss: "",
    havButtons: {Usd: true, Btc: true, Eth: false },
    havChartName: HAV_CHART.HavvenPrice,
    nUSDChartName: nUSD_CHART.NominPrice,
  };

  componentDidMount() {
    this.switchTheme();
  }

  componentWillMount() {
    this.fetchCharts();
    this.setState({
      intervalId: setInterval(this.fetchCharts, 60000)
    });
  }

  onCurrencyClick = (val) => {
    let havButtons = {...this.state.havButtons};
    havButtons[val] = !havButtons[val];
    this.setState({
      havButtons
    });
  };

  setHavChart = (chartName) => {
    this.setState({havChartName:chartName});
  };

  setnUSDChart = (chartName) => {
    this.setState({nUSDChartName:chartName});
  };

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.theme !== this.props.theme) {
      this.switchTheme();
    }
  }

  fetchCharts = () => {
    this.props.fetchCharts();
  };

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
    const { activeSection, themeCss, havButtons, havChartName, nUSDChartName } = this.state;
    const { stats, lastUpdated } = charts;
    const { HavvenMarketCap, HavvenVolume24h, HavvenPrice, LockedUpHavven } = HAV_CHART;
    const { NominMarketCap, NominVolume24h, NominPrice, CollateralizationRatio, NominFeesCollected } = nUSD_CHART;

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
                  <button className={"button is-link" + (havChartName === HavvenMarketCap ? " is-active" : "")} onClick={()=>{this.setHavChart(HavvenMarketCap)}}>Market Cap</button>
                </div>
                <div className="level-item">
                  <button className={"button is-link" + (havChartName === HavvenPrice ? " is-active" : "")} onClick={()=>{this.setHavChart(HavvenPrice)}}>Price</button>
                </div>
                <div className="level-item">
                  <button className={"button is-link" + (havChartName === HavvenVolume24h ? " is-active" : "")} onClick={()=>{this.setHavChart(HavvenVolume24h)}}>Volume</button>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <Chart
                  info={charts[havChartName]}
                  decimals={DECIMALS[havChartName]}
                  onCursorChange={this.onCursorChange}
                  fullSize={true}
                  colorGradient="green"
                  lastUpdated={lastUpdated}
                  currencySwitch={this.state.havButtons}
                  tooltipDecimal={{}}
                />
              </div>
            </div>
            <div className="level">
              <div className="level-left">
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button className="button is-link is-active" onClick={()=>this.onCurrencyClick("Usd")}>USD</button>
                </div>
                <div className="level-item">
                  <button className={"button is-link" + (havButtons.Btc ? " is-active" : "")} onClick={()=>this.onCurrencyClick("Btc")}>BTC</button>
                </div>
                <div className="level-item">
                  <button className={"button is-link" + (havButtons.Eth ? " is-active" : "")} onClick={()=>this.onCurrencyClick("Eth")}>ETH</button>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <Chart
                  info={charts.LockedUpHavven}
                  decimals={DECIMALS[LockedUpHavven]}
                  onCursorChange={this.onCursorChange}
                  colorGradient="yellow"
                  lastUpdated={lastUpdated}
                />
              </div>
              <div className="column">
                <Chart
                  info={charts.HavvenVolume24h}
                  decimals={DECIMALS[HavvenVolume24h]}
                  onCursorChange={this.onCursorChange}
                  colorGradient="red"
                  lastUpdated={lastUpdated}
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
                  <button className={"button is-link" + (nUSDChartName === NominMarketCap ? " is-active" : "")} onClick={()=>{this.setnUSDChart(NominMarketCap)}}>Market Cap</button>
                </div>
                <div className="level-item">
                  <button className={"button is-link" + (nUSDChartName === NominPrice ? " is-active" : "")} onClick={()=>{this.setnUSDChart(NominPrice)}}>Price</button>
                </div>
                <div className="level-item">
                  <button className={"button is-link" + (nUSDChartName === NominVolume24h ? " is-active" : "")} onClick={()=>{this.setnUSDChart(NominVolume24h)}}>Volume</button>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <Chart
                  info={charts[nUSDChartName]}
                  decimals={DECIMALS[nUSDChartName]}
                  onCursorChange={this.onCursorChange}
                  fullSize={true}
                  colorGradient="green"
                  lastUpdated={lastUpdated}
                />
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <Chart
                  info={charts.NominFeesCollected}
                  decimals={DECIMALS[NominFeesCollected]}
                  onCursorChange={this.onCursorChange}
                  colorGradient="green"
                  lastUpdated={lastUpdated}
                />
              </div>
              <div className="column">
                <Chart
                  info={charts.CollateralizationRatio}
                  decimals={DECIMALS[CollateralizationRatio]}
                  onCursorChange={this.onCursorChange}
                  colorGradient="red"
                  lastUpdated={lastUpdated}
                  sign="%"
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
