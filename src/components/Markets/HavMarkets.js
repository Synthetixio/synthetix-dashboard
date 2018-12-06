import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import { fetchHAV, fetchCoinmarketcapHAV } from '../../actions/markets';
import { fetchCharts } from '../../actions/charts';

import { MarketsInfo } from './MarketsInfo';

const isEmptyObj = obj => Object.keys(obj).length;

export class HavMarketsComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchHAV();
    this.props.fetchCharts();
    this.props.fetchCoinmarketcapHAV();
  }

  render() {
    const charts = this.props.charts;
    const snx = this.props.markets.snx;
    const snx_info = isEmptyObj(snx) ? snx : null;
    const charts_info = isEmptyObj(charts.stats) ? charts : null;
    if (snx_info === null || charts_info === null) return null;
    return (
      <div>
        <MarketsInfo
          currency={snx_info}
          lastUpdated={charts_info.lastUpdated}
          toggleCurrencyType={'View sUSD'}
          currencyType={'SNX'}
          toggleCurrencyUrl={'/buy-susd'}
        />
        <div className="markets__holder">
          <div className="table-container container">
            <table>
              <thead>
                <tr>
                  <th className="table_ttl">
                    <span className="desktop">SNX Markets</span>
                    <span className="mobile">Exchange</span>
                  </th>
                  <th>Pair</th>
                  <th className="desktop" />
                  <th className="align-right">Volume (24h)</th>
                  <th className="align-right">Price</th>
                  <th className="align-right">
                    <span className="volume">
                      Volume <span className="desktop">(%)</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.markets.coinSNX.map(
                  ({ source, pair, volume24, volume, price, updated }, idx) => (
                    <tr key={`t_row_${idx}`}>
                      <td>
                        <span className="flex">
                          <span className="num">{idx + 1}</span>
                          <img
                            src={`/images/markets/hav/${source.content}.png`}
                            alt=""
                          />
                          <span>{source.content}</span>
                        </span>
                      </td>
                      <td className="violet">
                        {pair.link === null ? (
                          pair.content
                        ) : (
                          <a href={pair.link} className="pair" target="_blank">
                            {' '}
                            {pair.content}{' '}
                          </a>
                        )}
                      </td>
                      <td className="desktop" />
                      <td className="align-right">{volume24.content}</td>
                      <td className="align-right">{price.content}</td>
                      <td className="align-right">{volume.content}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { markets, charts } = state;

  return {
    markets,
    charts,
  };
};

const HavMarkets = connect(
  mapStateToProps,
  {
    fetchHAV,
    fetchCharts,
    fetchCoinmarketcapHAV,
  }
)(HavMarketsComponent);

export default HavMarkets;
