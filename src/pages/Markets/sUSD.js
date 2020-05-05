import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchNUSD, fetchCoinmarketcapNUSD } from '../../actions/markets';
import { fetchCharts } from '../../actions/charts';
import { isEmptyObj, CHARTS } from '../../utils';
import { MarketsInfo } from './MarketsInfo';

export class NusdMarketsComponent extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { charts, fetchCharts, fetchNUSD, fetchCoinmarketcapNUSD } = this.props;
		fetchNUSD();
		if (isEmptyObj(charts.stats)) {
			fetchCharts(CHARTS.DAY);
			fetchCharts(CHARTS.MONTH);
		}
		fetchCoinmarketcapNUSD();
		this.setState({ intervalId: setInterval(() => fetchCharts(CHARTS.MONTH), 10 * 60 * 1000) });
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	render() {
		const {
			charts,
			markets: { susd },
		} = this.props;
		const susd_info = isEmptyObj(susd) ? null : susd;
		const charts_info = isEmptyObj(charts.stats) ? null : charts;
		if (susd_info === null || charts_info === null) return null;
		return (
			<div>
				<MarketsInfo
					currency={susd_info}
					lastUpdated={charts_info.lastUpdated}
					toggleCurrencyType={'View SNX'}
					currencyType={'sUSD'}
					toggleCurrencyUrl={'/buy-snx'}
				/>
				<div className="markets__holder">
					<div className="table-container container">
						<table>
							<thead>
								<tr>
									<th className="table_ttl">
										<span className="desktop">sUSD Markets</span>
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
								{this.props.markets.coinSUSD.map(
									({ source, pair, volume24, volume, price }, idx) => (
										<tr key={`t_row_${idx}`}>
											<td>
												<span className="flex">
													<span className="num">{idx + 1}</span>
													<img src={`/images/markets/hav/${source.content}.png`} alt="" />
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

const NusdMarkets = connect(
	mapStateToProps,
	{
		fetchNUSD,
		fetchCharts,
		fetchCoinmarketcapNUSD,
	}
)(NusdMarketsComponent);

export default NusdMarkets;
