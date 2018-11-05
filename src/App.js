import React from 'react';
import Chart from 'components/Chart';
import { connect } from 'react-redux';
import { fetchCharts, setPeriod } from './actions/charts';
import { fetchHAV, fetchNUSD } from './actions/markets';
import SingleStatBox from 'components/SingleStatBox';
import TopNavBar from 'components/TopNavBar';
import { switchTheme } from 'actions/theme';
import cx from 'classnames';
import differenceInMins from 'date-fns/difference_in_minutes';
import SingleStat from 'components/SingleStat';
import numeral from 'numeral';
import { scroller } from 'react-scroll';

import { Link } from 'react-router-dom';

const HAV_CHART = {
  HavvenPrice: 'HavvenPrice',
  HavvenMarketCap: 'HavvenMarketCap',
  HavvenVolume24h: 'HavvenVolume24h',
  // LockedUpHavven: "LockedUpHavven",
  UnlockedHavBalance: 'UnlockedHavBalance',
  LockedHavBalance: 'LockedHavBalance',
  LockedHavRatio: 'LockedHavRatio',
};
const nUSD_CHART = {
  NominPrice: 'NominPrice',
  NominMarketCap: 'NominMarketCap',
  NominVolume24h: 'NominVolume24h',
  NominFeesCollected: 'NominFeesCollected',
  CollateralizationRatio: 'CollateralizationRatio',
  ActiveCollateralizationRatio: 'ActiveCollateralizationRatio',
};
const DECIMALS = {
  HavvenMarketCap: { Val: 0, Btc: 0 },
  HavvenPrice: { Val: 3, Btc: 7 },
  HavvenVolume24h: { Val: 0, Btc: 0 },
  // LockedUpHavven: { Val: 0 },
  UnlockedHavBalance: { Val: 0 },
  LockedHavBalance: { Val: 0 },
  LockedHavRatio: { Val: 2 },
  NominMarketCap: { Val: 2 },
  NominPrice: { Val: 3 },
  NominVolume24h: { Val: 2 },
  NominFeesCollected: { Val: 2 },
  CollateralizationRatio: { Val: 2 }, //%
  ActiveCollateralizationRatio: { Val: 2 }, //%
};

const formatCRatio = data => {
  return data > 0 ? 10000 / data : 0;
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activeSection: 'stats',
    themeCss: '',
    themeCssLoaded: false,
    havButtons: { Usd: true, Btc: true, Eth: false },
    havChartName: HAV_CHART.HavvenPrice,
    nUSDChartName: nUSD_CHART.NominPrice,
  };

  componentWillMount() {
    this.switchTheme();
    this.props.fetchHAV();
    this.props.fetchNUSD();
    this.fetchCharts();
    this.setState({
      intervalId: setInterval(this.fetchCharts, 10 * 60 * 1000),
    });
  }

  onCurrencyClick = val => {
    let havButtons = { ...this.state.havButtons };
    havButtons[val] = !havButtons[val];
    this.setState({
      havButtons,
    });
  };

  setHavChart = chartName => {
    this.setState({ havChartName: chartName });
  };

  setnUSDChart = chartName => {
    this.setState({ nUSDChartName: chartName });
  };

  setPeriod = (val, token) => {
    this.props.setPeriod(val, token);
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
    if (this.props.theme === 'dark') {
      import(`styling/dark.css`).then(res => {
        this.setState({ themeCss: res[0][1] }, () => {
          setTimeout(() => {
            this.setState({ themeCssLoaded: true });
          }, 1200);
        });
      });
    } else {
      import(`styling/light.css`).then(res => {
        this.setState({ themeCss: res[0][1] }, () => {
          setTimeout(() => {
            this.setState({ themeCssLoaded: true });
          }, 1200);
        });
      });
    }
  }

  getMarketsData() {
    const { markets } = this.props;
    const data = { havMarketData: {}, nusdMarketData: {} };
    ['hav', 'nusd'].forEach(currency => {
      if (
        markets[currency] &&
        markets[currency].quotes &&
        markets[currency].quotes.USD
      ) {
        data[`${currency}MarketData`] = { ...markets[currency].quotes.USD };
      }
    });
    return data;
  }

  render() {
    const { charts, theme } = this.props;
    const { havPeriod, nUSDPeriod } = charts;
    const {
      activeSection,
      themeCss,
      havButtons,
      havChartName,
      nUSDChartName,
      themeCssLoaded,
    } = this.state;
    const { stats, lastUpdated } = charts;
    const {
      HavvenMarketCap,
      HavvenVolume24h,
      HavvenPrice,
      // LockedUpHavven,
      UnlockedHavBalance,
      LockedHavBalance,
      LockedHavRatio,
    } = HAV_CHART;
    const {
      NominMarketCap,
      NominVolume24h,
      NominPrice,
      CollateralizationRatio,
      ActiveCollateralizationRatio,
      NominFeesCollected,
    } = nUSD_CHART;

    let minsAgo = differenceInMins(Date.now(), lastUpdated);
    minsAgo = isNaN(minsAgo) ? '-' : minsAgo;
    const { havMarketData, nusdMarketData } = this.getMarketsData();
    const scrollToOptions = {
      duration: 500,
      delay: 100,
      smooth: 'easeInOutQuint',
      offset: -110,
    };

    const havStats = {
      [HAV_CHART.HavvenMarketCap]: {
        value: havMarketData.market_cap,
        trend: stats.havvenMarketCap24hDelta,
        decimals: 0,
      },
      [HAV_CHART.HavvenPrice]: {
        value: havMarketData.price,
        trend: stats.havvenPriceCap24hDelta,
        decimals: 3,
      },
      [HAV_CHART.HavvenVolume24h]: {
        value: havMarketData.volume_24h,
        trend: stats.havvenMarketCap24hDelta,
        decimals: 0,
      },
    };
    const currentHavStat = havStats[havChartName];

    const nominStats = {
      [nUSD_CHART.NominMarketCap]: {
        value: nusdMarketData.market_cap,
        trend: stats.nominMarketCap24hDelta,
        decimals: 0,
      },
      [nUSD_CHART.NominPrice]: {
        value: nusdMarketData.price,
        trend: stats.nominPriceCap24hDelta,
        decimals: 3,
      },
      [nUSD_CHART.NominVolume24h]: {
        value: nusdMarketData.volume_24h,
        trend: stats.nominMarketCap24hDelta,
        decimals: 0,
      },
    };
    const currentNominStat = nominStats[nUSDChartName];
    const cssAfterLoad = 'html {transition: all 1s ease}';

    return (
      <div className="dashboard-root">
        <style>{themeCssLoaded ? cssAfterLoad : ''}</style>
        <style>{themeCss}</style>
        <div className="is-hidden-mobile last-updated-top">
          <label>LAST UPDATED</label> <span>{minsAgo} MINS AGO</span>{' '}
        </div>
        <TopNavBar selectedSection={activeSection} />
        <div className="container main-content">
          <div className="columns is-multiline" id="stats">
            <Link
              to="/buy-hav"
              className="column is-half-tablet is-one-quarter-desktop markets-link"
            >
              <SingleStatBox
                value={havMarketData ? havMarketData.market_cap : null}
                trend={stats.havvenMarketCap24hDelta * 100}
                label="HAVVEN MARKET CAP"
                desc="The total value of all circulating HAV, determined by multiplying the current price of 1 HAV by the circulating supply of HAV."
                onClick={() => {
                  this.setHavChart(HavvenMarketCap);
                  scroller.scrollTo('hav-main-chart', scrollToOptions);
                }}
                decimals={0}
              />
            </Link>
            <Link
              to="/buy-hav"
              className="column is-half-tablet is-one-quarter-desktop markets-link"
            >
              <SingleStatBox
                value={havMarketData ? havMarketData.price : null}
                trend={stats.havvenPriceCap24hDelta * 100}
                label="HAVVEN PRICE"
                desc="The average price of 1 HAV across all available exchanges."
                decimals={3}
                onClick={() => {
                  this.setHavChart(HavvenPrice);
                  scroller.scrollTo('hav-main-chart', scrollToOptions);
                }}
              />
            </Link>
            <Link
              to="/buy-nusd"
              className="column is-half-tablet is-one-quarter-desktop markets-link"
            >
              <SingleStatBox
                value={nusdMarketData ? nusdMarketData.market_cap : null}
                trend={stats.nominMarketCap24hDelta * 100}
                label="nUSD MARKET CAP"
                desc="The total value of all circulating nUSD, determined by multiplying the current price of 1 nUSD by the circulating supply of nUSD."
                onClick={() => {
                  this.setnUSDChart(NominMarketCap);
                  scroller.scrollTo('nomin-main-chart', scrollToOptions);
                }}
                decimals={0}
              />
            </Link>
            <Link
              to="/buy-nusd"
              className="column is-half-tablet is-one-quarter-desktop markets-link"
            >
              <SingleStatBox
                value={nusdMarketData ? nusdMarketData.price : null}
                trend={stats.nominPriceCap24hDelta * 100}
                label="nUSD PRICE"
                desc="The average price of 1 nUSD across all available exchanges."
                decimals={3}
                onClick={() => {
                  this.setnUSDChart(NominPrice);
                  scroller.scrollTo('nomin-main-chart', scrollToOptions);
                }}
              />
            </Link>
          </div>
        </div>
        <div className="container chart-section" id="hav">
          <div>
            <div className="level is-mobile chart-section__heading">
              <div className="level-left is-hidden-mobile">
                <div className="level-item title">
                  <h2>HAV</h2>
                  <span>(HAVVEN)</span>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button
                    className={cx('button', 'is-link', {
                      'is-active': havChartName === HavvenMarketCap,
                    })}
                    onClick={() => {
                      this.setHavChart(HavvenMarketCap);
                    }}
                  >
                    Market Cap
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx('button', 'is-link', {
                      'is-active': havChartName === HavvenPrice,
                    })}
                    onClick={() => {
                      this.setHavChart(HavvenPrice);
                    }}
                  >
                    Price
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx('button', 'is-link', {
                      'is-active': havChartName === HavvenVolume24h,
                    })}
                    onClick={() => {
                      this.setHavChart(HavvenVolume24h);
                    }}
                  >
                    Volume
                  </button>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="chart-box chart-box--main" id="hav-main-chart">
                  <SingleStat {...currentHavStat} />
                  <div className="time-toggles is-hidden-mobile">
                    <button
                      onClick={() => this.setPeriod('1D', 'HAV')}
                      className={cx({
                        'is-active': havPeriod === '1D',
                      })}
                    >
                      1D
                    </button>
                    <button
                      onClick={() => this.setPeriod('1W', 'HAV')}
                      className={cx({
                        'is-active': havPeriod === '1W',
                      })}
                    >
                      1W
                    </button>
                    <button
                      onClick={() => this.setPeriod('1M', 'HAV')}
                      className={cx({
                        'is-active': havPeriod === '1M',
                      })}
                    >
                      1M
                    </button>
                    <button
                      onClick={() => this.setPeriod('1Y', 'HAV')}
                      className={cx({
                        'is-active': havPeriod === '1Y',
                      })}
                    >
                      1Y
                    </button>
                    <button
                      onClick={() => this.setPeriod('ALL', 'HAV')}
                      className={cx({
                        'is-active': havPeriod === 'ALL',
                      })}
                    >
                      ALL
                    </button>
                  </div>
                  <div>
                    <Chart
                      period={havPeriod}
                      info={charts[havChartName]}
                      decimals={DECIMALS[havChartName]}
                      fullSize={true}
                      colorGradient="green"
                      lastUpdated={lastUpdated}
                      currencySwitch={this.state.havButtons}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="time-toggles is-hidden-tablet">
              <button
                onClick={() => this.setPeriod('1D', 'HAV')}
                className={cx({
                  'is-active': havPeriod === '1D',
                })}
              >
                1D
              </button>
              <button
                onClick={() => this.setPeriod('1W', 'HAV')}
                className={cx({
                  'is-active': havPeriod === '1W',
                })}
              >
                1W
              </button>
              <button
                onClick={() => this.setPeriod('1M', 'HAV')}
                className={cx({
                  'is-active': havPeriod === '1M',
                })}
              >
                1M
              </button>
              <button
                onClick={() => this.setPeriod('1Y', 'HAV')}
                className={cx({
                  'is-active': havPeriod === '1Y',
                })}
              >
                1Y
              </button>
              <button
                onClick={() => this.setPeriod('ALL', 'HAV')}
                className={cx({
                  'is-active': havPeriod === 'ALL',
                })}
              >
                ALL
              </button>
            </div>
            <div className="level is-mobile justified-content-center">
              <div className="level-left" />
              <div className="level-right currency-toggles">
                <div className="level-item">
                  <button
                    className={cx('button is-link usd', {
                      'is-active': havButtons.Usd,
                    })}
                    onClick={() => this.onCurrencyClick('Usd')}
                  >
                    USD
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx('button is-link btc', {
                      'is-active': havButtons.Btc,
                    })}
                    onClick={() => this.onCurrencyClick('Btc')}
                  >
                    BTC
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx('button is-link eth', {
                      'is-active': havButtons.Eth,
                    })}
                    onClick={() => this.onCurrencyClick('Eth')}
                  >
                    ETH
                  </button>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>LOCKED HAV VALUE</h3>
                    <div>The total value of all locked HAV.</div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(stats.lockedHavUsdBalance).format(`$0,0.`)}
                  </div>
                  <Chart
                    period={havPeriod}
                    info={charts.LockedHavUsdBalance}
                    decimals={DECIMALS[LockedHavBalance]}
                    colorGradient="red"
                    lastUpdated={lastUpdated}
                  />
                </div>
              </div>
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>LOCKED HAV RATIO</h3>
                    <div>
                      The ratio of total locked HAV against the total
                      circulating HAV.
                    </div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(stats.lockedHavRatio * 100).format('0.00')}%
                  </div>
                  <Chart
                    period={havPeriod}
                    info={charts.LockedHavRatio}
                    decimals={DECIMALS.LockedHavRatio}
                    colorGradient="yellow"
                    lastUpdated={lastUpdated}
                    sign="%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container chart-section" id="nusd">
          <div>
            <div className="level is-mobile chart-section__heading">
              <div className="level-left is-hidden-mobile">
                <div className="level-item title">
                  <h2>nUSD</h2>
                  <span>(NOMINS)</span>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button
                    className={cx('button', 'is-link', {
                      'is-active': nUSDChartName === NominMarketCap,
                    })}
                    onClick={() => {
                      this.setnUSDChart(NominMarketCap);
                    }}
                  >
                    Market Cap
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx('button', 'is-link', {
                      'is-active': nUSDChartName === NominPrice,
                    })}
                    onClick={() => {
                      this.setnUSDChart(NominPrice);
                    }}
                  >
                    Price
                  </button>
                </div>
                <div className="level-item">
                  <button
                    className={cx('button', 'is-link', {
                      'is-active': nUSDChartName === NominVolume24h,
                    })}
                    onClick={() => {
                      this.setnUSDChart(NominVolume24h);
                    }}
                  >
                    Volume
                  </button>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <div
                  className="chart-box chart-box--main"
                  id="nomin-main-chart"
                >
                  <SingleStat {...currentNominStat} />
                  <div className="time-toggles is-hidden-mobile">
                    <button
                      onClick={() => this.setPeriod('1D', 'nUSD')}
                      className={cx({
                        'is-active': nUSDPeriod === '1D',
                      })}
                    >
                      1D
                    </button>
                    <button
                      onClick={() => this.setPeriod('1W', 'nUSD')}
                      className={cx({
                        'is-active': nUSDPeriod === '1W',
                      })}
                    >
                      1W
                    </button>
                    <button
                      onClick={() => this.setPeriod('1M', 'nUSD')}
                      className={cx({
                        'is-active': nUSDPeriod === '1M',
                      })}
                    >
                      1M
                    </button>
                    <button
                      onClick={() => this.setPeriod('1Y', 'nUSD')}
                      className={cx({
                        'is-active': nUSDPeriod === '1Y',
                      })}
                    >
                      1Y
                    </button>
                    <button
                      onClick={() => this.setPeriod('ALL', 'nUSD')}
                      className={cx({
                        'is-active': nUSDPeriod === 'ALL',
                      })}
                    >
                      ALL
                    </button>
                  </div>
                  <div>
                    <Chart
                      period={nUSDPeriod}
                      info={charts[nUSDChartName]}
                      decimals={DECIMALS[nUSDChartName]}
                      fullSize={true}
                      colorGradient="green"
                      lastUpdated={lastUpdated}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="time-toggles is-hidden-tablet">
              <button
                onClick={() => this.setPeriod('1D', 'nUSD')}
                className={cx({
                  'is-active': nUSDPeriod === '1D',
                })}
              >
                1D
              </button>
              <button
                onClick={() => this.setPeriod('1W', 'nUSD')}
                className={cx({
                  'is-active': nUSDPeriod === '1W',
                })}
              >
                1W
              </button>
              <button
                onClick={() => this.setPeriod('1M', 'nUSD')}
                className={cx({
                  'is-active': nUSDPeriod === '1M',
                })}
              >
                1M
              </button>
              <button
                onClick={() => this.setPeriod('1Y', 'nUSD')}
                className={cx({
                  'is-active': nUSDPeriod === '1Y',
                })}
              >
                1Y
              </button>
              <button
                onClick={() => this.setPeriod('ALL', 'nUSD')}
                className={cx({
                  'is-active': nUSDPeriod === 'ALL',
                })}
              >
                ALL
              </button>
            </div>
            <div className="columns">
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>FEE POOL</h3>
                    <div>Transaction fees generated & available to claim.</div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(stats.nominFeesCollected).format(`$0,0.`)}
                  </div>
                  <Chart
                    period={nUSDPeriod}
                    fullSize={true}
                    info={charts.NominFeesCollected}
                    decimals={DECIMALS[NominFeesCollected]}
                    colorGradient="green"
                    lastUpdated={lastUpdated}
                  />
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>NETWORK COLLATERALIZATION RATIO</h3>
                    <div>
                      The ratio of circulating nUSD against the value of all
                      HAV.
                    </div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(
                      stats.collateralizationRatio > 0
                        ? 100 / stats.collateralizationRatio
                        : 0
                    ).format('0.00')}
                    %
                  </div>
                  <Chart
                    period={nUSDPeriod}
                    info={charts.CollateralizationRatio}
                    formatTooltip={formatCRatio}
                    decimals={DECIMALS[CollateralizationRatio]}
                    colorGradient="red"
                    lastUpdated={lastUpdated}
                    sign="%"
                  />
                </div>
              </div>
              <div className="column">
                <div className="chart-box">
                  <div className="chart-box__info">
                    <h3>ACTIVE COLLATERALIZATION RATIO</h3>
                    <div>
                      The ratio of circulating nUSD against the value of all
                      locked HAV.
                    </div>
                  </div>
                  <div className="chart-box__number">
                    {numeral(
                      stats.activeCollateralizationRatio > 0
                        ? 100 / stats.activeCollateralizationRatio
                        : 0
                    ).format('0.00')}
                    %
                  </div>
                  <Chart
                    period={nUSDPeriod}
                    info={charts.ActiveCollateralizationRatio}
                    decimals={DECIMALS[ActiveCollateralizationRatio]}
                    formatTooltip={formatCRatio}
                    colorGradient="yellow"
                    lastUpdated={lastUpdated}
                    sign="%"
                  />
                </div>
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
                  className={cx('theme-switcher', theme)}
                  onClick={() =>
                    this.props.switchTheme(theme === 'dark' ? 'light' : 'dark')
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
  const { charts, theme, markets } = state;

  return {
    charts,
    theme: theme.theme,
    markets,
  };
};

const ConnectedApp = connect(
  mapStateToProps,
  {
    switchTheme,
    fetchCharts,
    fetchHAV,
    fetchNUSD,
    setPeriod,
  }
)(App);
export default ConnectedApp;
