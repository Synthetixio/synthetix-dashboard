import React from 'react';
import { connect } from 'react-redux';
import { fetchCharts, setPeriod } from '../../actions/charts';
import {
	fetchBinaryOptionsMarkets,
	fetchBinaryOptionsTransactions,
} from '../../actions/binaryOptions';
import { fetchSNX, fetchNUSD } from '../../actions/markets';
import { fetchOpenInterest, fetchTradingVolume, fetchUniswapData } from '../../actions/exchange';
import { fetchNetworkData, fetchNetworkFees, fetchNetworkDepot } from '../../actions/network';
import Chart from '../../components/Chart';
import PieChart from '../../components/PieChart';
import HorizontalBarChart from '../../components/HorizontalBarChart';
import TopNavBar from '../../components/TopNavBar';
import SingleStatBox from '../../components/SingleStatBox';
import { switchTheme } from '../../actions/theme';
import { CHARTS, toPercent } from '../../utils';
import cx from 'classnames';
import numeral from 'numeral';
import { scroller } from 'react-scroll';

const SNX_CHART = {
	SnxPrice: 'SnxPrice',
	SnxVolume24h: 'SnxVolume24h',
};
const sUSD_CHART = {
	sUSDPrice: 'sUSDPrice',
	sUSDVolume24h: 'sUSDVolume24h',
};
const DECIMALS = {
	SnxPrice: { Val: 3, Eth: 7 },
	SnxVolume24h: { Val: 0, Eth: 0 },
	sUSDPrice: { Val: 3 },
	sUSDVolume24h: { Val: 2 },
};

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		snxButtons: { Usd: true, Eth: true },
		snxChartName: SNX_CHART.SnxPrice,
		sUSDChartName: sUSD_CHART.sUSDPrice,
	};

	componentDidMount() {
		const {
			snxjs,
			fetchSNX,
			fetchNUSD,
			fetchCharts,
			fetchOpenInterest,
			fetchTradingVolume,
			fetchUniswapData,
			fetchNetworkData,
			fetchNetworkFees,
			fetchNetworkDepot,
			charts,
			fetchBinaryOptionsTransactions,
			fetchBinaryOptionsMarkets,
		} = this.props;

		fetchSNX();
		fetchNUSD();
		fetchOpenInterest(snxjs);
		fetchTradingVolume();
		fetchBinaryOptionsTransactions();
		fetchBinaryOptionsMarkets();

		fetchUniswapData(snxjs);
		fetchNetworkData(snxjs);
		fetchNetworkFees(snxjs);
		fetchNetworkDepot(snxjs);
		if (!charts.periodLoaded) {
			fetchCharts(CHARTS.DAY);
			fetchCharts(CHARTS.MONTH);
		}
		this.setState({
			intervalId: setInterval(() => fetchCharts(CHARTS.MONTH), 10 * 60 * 1000),
			sethProxyAddress: snxjs.sETH.contract.address,
		});
	}

	onCurrencyClick = val => {
		const snxButtons = { ...this.state.snxButtons };
		snxButtons[val] = !snxButtons[val];
		this.setState({
			snxButtons,
		});
	};

	setSnxChart = chartName => {
		this.setState({ snxChartName: chartName });
	};

	setsUSDChart = chartName => {
		this.setState({ sUSDChartName: chartName });
	};

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	getMarketsData() {
		const { markets } = this.props;
		const data = { snxMarketData: {}, susdMarketData: {} };
		['snx', 'susd'].forEach(currency => {
			if (markets[currency] && markets[currency].quote && markets[currency].quote.USD) {
				data[`${currency}MarketData`] = {
					...markets[currency].quote.USD,
					total_supply: markets[currency].total_supply,
				};
			}
		});
		return data;
	}

	render() {
		const { charts, theme, exchange, network, setPeriod, binaryOptions } = this.props;
		const { snxPeriod, sUSDPeriod } = charts;
		const { snxButtons, snxChartName, sUSDChartName, sethProxyAddress } = this.state;
		const { lastUpdated } = charts;
		const { SnxVolume24h, SnxPrice } = SNX_CHART;
		const { sUSDVolume24h, sUSDPrice } = sUSD_CHART;

		const { snxMarketData, susdMarketData } = this.getMarketsData();
		const scrollToOptions = {
			duration: 500,
			delay: 100,
			smooth: 'easeInOutQuint',
			offset: -110,
		};

		const formattedDistribution = [];
		let totalDistribution = 0;

		if (exchange.openInterest) {
			totalDistribution = exchange.openInterest.reduce((acc, val) => acc + val.value, 0);
			let cumulativeDistributionValue = 0;
			let otherDistributionValue = 0;
			let hasReached = false;
			exchange.openInterest
				.sort((a, b) => b.value - a.value)
				.forEach(synth => {
					if (!hasReached && cumulativeDistributionValue / totalDistribution < 0.9) {
						formattedDistribution.push(synth);
						cumulativeDistributionValue += synth.value;
					} else {
						hasReached = true;
						otherDistributionValue += synth.value;
					}
				});
			formattedDistribution.push({
				name: 'Others',
				value: otherDistributionValue,
			});
		}

		const sETHPrice = exchange.rate ? exchange.rate : null;
		const sETHMarketCap =
			exchange.openInterest && exchange.openInterest.find(s => s.name === 'sETH');

		const sETHPool = exchange.uniswap;
		const sETHtoETHRate = sETHPool ? parseFloat(sETHPool.eth) / parseFloat(sETHPool.synth) : null;
		return (
			<div className="dashboard-root">
				<TopNavBar selectedSection="stats" />
				<div className="container main-content">
					<div className="columns is-multiline" id="stats">
						<SingleStatBox
							value={snxMarketData ? snxMarketData.market_cap : null}
							trend={null}
							label="SNX MARKET CAP"
							desc="The total value of all circulating SNX."
							decimals={0}
							isClickable={true}
						/>
						<SingleStatBox
							value={snxMarketData ? snxMarketData.price : null}
							trend={snxMarketData ? snxMarketData.percent_change_24h : null}
							label="SNX PRICE"
							desc="The average price of SNX across exchanges."
							decimals={3}
							onClick={() => {
								this.setSnxChart(SnxPrice);
								scroller.scrollTo('snx-main-chart', scrollToOptions);
							}}
							isClickable={true}
						/>
						<SingleStatBox
							value={susdMarketData ? susdMarketData.market_cap : null}
							trend={null}
							label="sUSD MARKET CAP"
							desc="The total value of all circulating sUSD."
							decimals={0}
							isClickable={true}
						/>
						<SingleStatBox
							value={susdMarketData ? susdMarketData.price : null}
							trend={susdMarketData ? susdMarketData.percent_change_24h : null}
							label="sUSD PRICE"
							desc="The average price of sUSD across exchanges."
							decimals={3}
							onClick={() => {
								this.setsUSDChart(sUSDPrice);
								scroller.scrollTo('susd-main-chart', scrollToOptions);
							}}
							isClickable={true}
						/>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={sETHMarketCap ? sETHMarketCap.value : null}
								label="sETH MARKET CAP"
								desc="The total value of all circulating sETH."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={sETHPrice ? sETHPrice : null}
								label="sETH PRICE"
								desc="The average price of sETH across exchanges."
								onClick={() => {}}
								decimals={3}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={sETHtoETHRate ? sETHtoETHRate : null}
								label="sETH UNISWAP RATE"
								desc={
									'Pool size: ' +
									(sETHPool
										? `${parseFloat(sETHPool.synth).toFixed(2)} sETH / ${parseFloat(
												sETHPool.eth
										  ).toFixed(2)} ETH`
										: '')
								}
								type="number"
								onClick={() => {
									window.open(`https://uniswap.exchange/swap/${sethProxyAddress}`, '__blank');
								}}
								decimals={3}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={totalDistribution ? totalDistribution : null}
								label="TOTAL SYNTH SUPPLY"
								desc="The total value of all circulating synths."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									network.totalIssuedSynths &&
									snxMarketData &&
									snxMarketData.total_supply &&
									snxMarketData.price
										? Number(
												((snxMarketData.price * snxMarketData.total_supply) /
													network.totalIssuedSynths) *
													100
										  ).toFixed(2)
										: null
								}
								type="percentage"
								label="NETWORK COLLATERALIZATION RATIO"
								desc="The aggregate collateralisation ratio of all SNX wallets."
								onClick={() => {}}
								decimals={2}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									network.activeCollateralizationRatio
										? toPercent(network.activeCollateralizationRatio)
										: null
								}
								type="percentage"
								label="ACTIVE COLLATERALIZATION RATIO"
								desc="The aggregate collateralisation ratio of SNX wallets that are currently staking."
								onClick={() => {}}
								decimals={2}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									network.percentLocked && snxMarketData && snxMarketData.market_cap > 0
										? toPercent((network.percentLocked / 100) * snxMarketData.market_cap)
										: null
								}
								label="LOCKED SNX VALUE"
								desc="The total value of all staked SNX."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={network.percentLocked ? toPercent(network.percentLocked) : null}
								type="percentage"
								label="LOCKED SNX RATIO"
								desc="The percentage of SNX tokens that are staked."
								onClick={() => {}}
								decimals={2}
							/>
						</div>

						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									exchange.volume && exchange.volume.last24Hours > 0
										? exchange.volume.last24Hours
										: null
								}
								label="SYNTHETIX.EXCHANGE VOLUME"
								desc="Synthetix.Exchange 24h trading volume."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									network.totalFeesAvailable && network.totalFeesAvailable > 0
										? network.totalFeesAvailable
										: null
								}
								label="CURRENT FEE POOL"
								desc="Total trading fees in the pool."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									network.unclaimedFees && network.unclaimedFees > 0 ? network.unclaimedFees : null
								}
								label="UNCLAIMED FEES IN POOL"
								desc="Trading fees currently claimable in the pool."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={exchange.totalFeesGenerated > 0 ? exchange.totalFeesGenerated : null}
								label="TOTAL FEES GENERATED"
								desc="Fees generated since launch (Dec 2018)."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={exchange.volume && exchange.volume.total > 0 ? exchange.volume.total : null}
								label="SYNTHETIX.EXCHANGE TOTAL VOL."
								desc="Synthetix.Exchange all time volume."
								onClick={() => {}}
								decimals={0}
							/>
						</div>

						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									network.totalRewardsAvailable && network.totalRewardsAvailable > 0
										? network.totalRewardsAvailable
										: null
								}
								label="CURRENT REWARDS POOL"
								desc="Total SNX rewards claimable this period."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									network.unclaimedRewards && network.unclaimedRewards > 0
										? network.unclaimedRewards
										: null
								}
								label="UNCLAIMED REWARDS IN POOL"
								desc="SNX rewards currently claimable in the pool."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={
									snxMarketData.volume_24h && snxMarketData.volume_24h > 0
										? snxMarketData.volume_24h
										: null
								}
								label="24HR SNX Trading Volume"
								desc="24HR SNX Trading Volume from Coinmarketcap API."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={binaryOptions.numMarkets}
								label="Active Binary Options Markets"
								desc="Number of Binary Options Markets currently active."
								onClick={() => {}}
								type="number"
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={binaryOptions.largestMarketPoolSize}
								label="Largest Active Binary Options Market"
								desc={`${binaryOptions.largestMarket} has the Largest Active Pool Size`}
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={binaryOptions.totalPoolSizes}
								label="Binary Options Markets Total Pools"
								desc="Sum of Pool Sizes for all Active Binary Options Markets."
								onClick={() => {}}
								decimals={0}
							/>
						</div>
						<div className="column is-half-tablet is-one-quarter-desktop markets-link">
							<SingleStatBox
								value={binaryOptions.numOptionsTransactions}
								label="24HR Binary Options Transactions"
								desc="Total Binary Options Transactions from the Past day."
								onClick={() => {}}
								type="number"
								decimals={0}
							/>
						</div>
					</div>
				</div>
				<div className="container chart-section" id="snx">
					<div>
						<div className="level is-mobile chart-section__heading">
							<div className="level-left is-hidden-mobile">
								<div className="level-item title">
									<h2>SNX</h2>
									<span>(UNISWAP DATA ONLY)</span>
								</div>
							</div>
							<div className="level-right">
								<div className="level-item">
									<button
										className={cx('button', 'is-link', {
											'is-active': snxChartName === SnxPrice,
										})}
										onClick={() => {
											this.setSnxChart(SnxPrice);
										}}
									>
										Price
									</button>
								</div>
								<div className="level-item">
									<button
										className={cx('button', 'is-link', {
											'is-active': snxChartName === SnxVolume24h,
										})}
										onClick={() => {
											this.setSnxChart(SnxVolume24h);
										}}
									>
										Volume
									</button>
								</div>
							</div>
						</div>
						<div className="columns">
							<div className="column">
								<div className="chart-box chart-box--main" id="snx-main-chart">
									<div className="chart-box__stat is-positive" />
									<div className="time-toggles is-hidden-mobile">
										<button
											onClick={() => setPeriod(CHARTS.DAY, 'SNX')}
											className={cx({
												'is-active': snxPeriod === CHARTS.DAY,
											})}
										>
											1D
										</button>
										{charts.periodLoaded === CHARTS.MONTH ? (
											<>
												<button
													onClick={() => setPeriod(CHARTS.WEEK, 'SNX')}
													className={cx({
														'is-active': snxPeriod === CHARTS.WEEK,
													})}
												>
													1W
												</button>
												<button
													onClick={() => setPeriod(CHARTS.MONTH, 'SNX')}
													className={cx({
														'is-active': snxPeriod === CHARTS.MONTH,
													})}
												>
													1M
												</button>
											</>
										) : null}
									</div>
									<div>
										<Chart
											isLightMode={theme === 'light'}
											period={snxPeriod}
											info={charts[snxChartName]}
											decimals={DECIMALS[snxChartName]}
											fullSize={true}
											colorGradient="green"
											lastUpdated={lastUpdated}
											currencySwitch={this.state.snxButtons}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="time-toggles is-hidden-tablet">
							<button
								onClick={() => setPeriod(CHARTS.DAY, 'SNX')}
								className={cx({
									'is-active': snxPeriod === CHARTS.DAY,
								})}
							>
								1D
							</button>
							{charts.periodLoaded === CHARTS.MONTH ? (
								<>
									<button
										onClick={() => setPeriod(CHARTS.WEEK, 'SNX')}
										className={cx({
											'is-active': snxPeriod === CHARTS.WEEK,
										})}
									>
										1W
									</button>
									<button
										onClick={() => setPeriod(CHARTS.MONTH, 'SNX')}
										className={cx({
											'is-active': snxPeriod === CHARTS.MONTH,
										})}
									>
										1M
									</button>
								</>
							) : null}
						</div>
						<div className="level is-mobile justified-content-center">
							<div className="level-left" />
							<div className="level-right currency-toggles">
								<div className="level-item">
									<button
										className={cx('button is-link usd', {
											'is-active': snxButtons.Usd,
										})}
										onClick={() => this.onCurrencyClick('Usd')}
									>
										USD
									</button>
								</div>
								<div className="level-item">
									<button
										className={cx('button is-link eth', {
											'is-active': snxButtons.Eth,
										})}
										onClick={() => this.onCurrencyClick('Eth')}
									>
										ETH
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container chart-section" id="susd">
					<div>
						<div className="level is-mobile chart-section__heading">
							<div className="level-left is-hidden-mobile">
								<div className="level-item title">
									<h2>sUSD</h2>
									<span>(UNISWAP DATA ONLY)</span>
								</div>
							</div>
							<div className="level-right">
								<div className="level-item">
									<button
										className={cx('button', 'is-link', {
											'is-active': sUSDChartName === sUSDPrice,
										})}
										onClick={() => {
											this.setsUSDChart(sUSDPrice);
										}}
									>
										Price
									</button>
								</div>
								<div className="level-item">
									<button
										className={cx('button', 'is-link', {
											'is-active': sUSDChartName === sUSDVolume24h,
										})}
										onClick={() => {
											this.setsUSDChart(sUSDVolume24h);
										}}
									>
										Volume
									</button>
								</div>
							</div>
						</div>

						<div className="columns">
							<div className="column">
								<div className="chart-box chart-box--main" id="susd-main-chart">
									<div className="chart-box__stat is-positive" />
									<div className="time-toggles is-hidden-mobile">
										<button
											onClick={() => setPeriod(CHARTS.DAY, 'sUSD')}
											className={cx({
												'is-active': sUSDPeriod === CHARTS.DAY,
											})}
										>
											1D
										</button>
										{charts.periodLoaded === CHARTS.MONTH ? (
											<>
												<button
													onClick={() => setPeriod(CHARTS.WEEK, 'sUSD')}
													className={cx({
														'is-active': sUSDPeriod === CHARTS.WEEK,
													})}
												>
													1W
												</button>
												<button
													onClick={() => setPeriod(CHARTS.MONTH, 'sUSD')}
													className={cx({
														'is-active': sUSDPeriod === CHARTS.MONTH,
													})}
												>
													1M
												</button>
											</>
										) : null}
									</div>
									<div>
										<Chart
											isLightMode={theme === 'light'}
											period={sUSDPeriod}
											info={charts[sUSDChartName]}
											decimals={DECIMALS[sUSDChartName]}
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
								onClick={() => setPeriod(CHARTS.DAY, 'sUSD')}
								className={cx({
									'is-active': sUSDPeriod === CHARTS.DAY,
								})}
							>
								1D
							</button>
							{charts.periodLoaded === CHARTS.MONTH ? (
								<>
									<button
										onClick={() => setPeriod(CHARTS.WEEK, 'sUSD')}
										className={cx({
											'is-active': sUSDPeriod === CHARTS.WEEK,
										})}
									>
										1W
									</button>
									<button
										onClick={() => setPeriod(CHARTS.MONTH, 'sUSD')}
										className={cx({
											'is-active': sUSDPeriod === CHARTS.MONTH,
										})}
									>
										1M
									</button>
								</>
							) : null}
						</div>
						<div className="columns">
							<div className="column">
								<div style={{ height: '100%' }} className="chart-box">
									<div className="chart-box__info">
										<div className="chart-box-title">
											<h3>OPEN INTEREST</h3>
											<span className="chart-box__number" />
										</div>
										<div className="chart-box-desc">Long/short interest on cryptoassets</div>
									</div>

									{exchange.shortsAndLongs ? (
										<HorizontalBarChart
											isLightMode={theme === 'light'}
											data={exchange.shortsAndLongs.map(synth => {
												return {
													x: synth.longs || 0,
													y: synth.shorts || 0,
													z: (synth.longs || 0) + (synth.shorts || 0),
													label: synth.name,
												};
											})}
										/>
									) : null}
								</div>
							</div>
							<div className="column">
								<div className="chart-box">
									<div className="chart-box__info">
										<div className="chart-box-title">
											<h3>SYNTHS DISTRIBUTION</h3>
											<span className="chart-box__number" />
										</div>
										<div className="chart-box-desc">Distribution of synths within the network</div>
									</div>
									{formattedDistribution && totalDistribution ? (
										<PieChart
											isLightMode={theme === 'light'}
											data={formattedDistribution.map(v => {
												return {
													x: v.name,
													y: v.value,
													label: `${v.name} (${((100 * v.value) / totalDistribution).toFixed(1)}%)`,
												};
											})}
										/>
									) : null}
									<div
										style={{
											width: '100%',
											textAlign: 'center',
											marginBottom: '20px',
										}}
									>
										Total Synth supply: {numeral(totalDistribution).format('$0,(0)')}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container main-content">
					<div className="columns">
						<div className="column">
							<div className="footer-info">
								<div
									className={cx('theme-switcher', theme)}
									onClick={() => this.props.switchTheme(theme === 'dark' ? 'light' : 'dark')}
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
	const { charts, theme, markets, exchange, network, binaryOptions } = state;
	return {
		charts,
		theme: theme.theme,
		markets,
		exchange,
		network,
		binaryOptions,
	};
};

const ConnectedApp = connect(
	mapStateToProps,
	{
		switchTheme,
		fetchCharts,
		fetchOpenInterest,
		fetchTradingVolume,
		fetchUniswapData,
		fetchSNX,
		fetchNUSD,
		setPeriod,
		fetchNetworkData,
		fetchNetworkFees,
		fetchNetworkDepot,
		fetchBinaryOptionsMarkets,
		fetchBinaryOptionsTransactions,
	}
)(App);
export default ConnectedApp;
