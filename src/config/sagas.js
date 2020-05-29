import orderBy from 'lodash/orderBy';
import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects';
import snxData, { pageResults } from 'synthetix-data';
import { SynthetixJs } from 'synthetix-js';

import {
	FETCH_CHARTS,
	FETCH_CHARTS_SUCCESS,
	FETCH_SNX_CURRENCY,
	FETCH_NUSD_CURRENCY,
	FETCH_OPEN_INTEREST,
	FETCH_OPEN_INTEREST_SUCCESS,
	FETCH_TRADING_VOLUME,
	FETCH_TRADING_VOLUME_SUCCESS,
	FETCH_UNISWAP_DATA,
	FETCH_UNISWAP_DATA_SUCCESS,
	FETCH_NETWORK_DATA,
	FETCH_NETWORK_DATA_SUCCESS,
	FETCH_NETWORK_DEPOT,
	FETCH_NETWORK_DEPOT_SUCCESS,
	FETCH_NETWORK_FEES,
	FETCH_NETWORK_FEES_SUCCESS,
} from '../actions/actionTypes';

import { doFetch } from './api';
import { getUniswapSusdData, getUniswapSnxData, synthSummaryUtilContract } from './helpers';
import { generateEndTimestamp } from '../utils';

export const uniswapGraph = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap';

//CHARTS
function* fetchUniswapChartsData({ payload: { period } }) {
	const endTimestamp = generateEndTimestamp(period);
	const sUSDExchangeData = yield getUniswapSusdData(endTimestamp);
	const snxExchangeData = yield getUniswapSnxData(endTimestamp);

	yield put({
		type: FETCH_CHARTS_SUCCESS,
		payload: {
			data: {
				snxExchangeData,
				sUSDExchangeData,
				period,
			},
		},
	});
}

function* fetchChartsCall() {
	yield takeEvery(FETCH_CHARTS, fetchUniswapChartsData);
}

function* fetchFeePeriodData(period, snxjs) {
	const newRecentFeePeriod = yield snxjs.FeePool.recentFeePeriods(period);
	return {
		feesToDistribute:
			Number(snxjs.ethers.utils.formatEther(newRecentFeePeriod.feesToDistribute)) || 0,
		feesClaimed: Number(snxjs.ethers.utils.formatEther(newRecentFeePeriod.feesClaimed)) || 0,
		rewardsToDistribute:
			Number(snxjs.ethers.utils.formatEther(newRecentFeePeriod.rewardsToDistribute)) || 0,
		rewardsClaimed: Number(snxjs.ethers.utils.formatEther(newRecentFeePeriod.rewardsClaimed)) || 0,
	};
}

// NETWORK
function* fetchNetworkDepotCall({ payload: { snxjs } }) {
	const depositsData = yield snxjs.Depot.totalSellableDeposits();
	const totalSellableDeposits = Number(snxjs.ethers.utils.formatEther(depositsData)) || 0;
	const data = { body: { totalSellableDeposits } };
	yield put({
		type: FETCH_NETWORK_DEPOT_SUCCESS,
		payload: { data },
	});
}

// NETWORK
function* fetchNetworkFeesCall({ payload: { snxjs } }) {
	const recentFeePeriod = yield fetchFeePeriodData(0, snxjs);
	const olderFeePeriod = yield fetchFeePeriodData(1, snxjs);

	const totalRewardsAvailable = recentFeePeriod.rewardsToDistribute;
	const unclaimedFees = olderFeePeriod.feesToDistribute - olderFeePeriod.feesClaimed;
	const unclaimedRewards = olderFeePeriod.rewardsToDistribute - olderFeePeriod.rewardsClaimed;
	const totalFeesAvailable = olderFeePeriod.feesToDistribute + recentFeePeriod.feesToDistribute;
	const data = {
		body: { totalFeesAvailable, totalRewardsAvailable, unclaimedFees, unclaimedRewards },
	};
	yield put({
		type: FETCH_NETWORK_FEES_SUCCESS,
		payload: { data },
	});
}

// NETWORK
function* fetchNetworkDataCall({ payload: { snxjs } }) {
	const toUtf8Bytes = SynthetixJs.utils.formatBytes32String;

	const holders = yield call(snxData.snx.holders, { max: 1000 });
	const [
		unformattedLastDebtLedgerEntry,
		unformattedTotalIssuedSynths,
		unformattedIssuanceRatio,
		unformattedUsdToSnxPrice,
	] = yield Promise.all([
		snxjs.SynthetixState.lastDebtLedgerEntry(),
		snxjs.Synthetix.contract.totalIssuedSynthsExcludeEtherCollateral(toUtf8Bytes('sUSD')),
		snxjs.SynthetixState.issuanceRatio(),
		snxjs.ExchangeRates.rateForCurrency(toUtf8Bytes('SNX')),
	]);

	const lastDebtLedgerEntry = Number(
		snxjs.ethers.utils.formatUnits(unformattedLastDebtLedgerEntry, 27)
	);

	const [totalIssuedSynths, issuanceRatio, usdToSnxPrice] = [
		unformattedTotalIssuedSynths,
		unformattedIssuanceRatio,
		unformattedUsdToSnxPrice,
	].map(val => Number(snxjs.utils.formatEther(val)));

	let snxTotal = 0;
	let snxLocked = 0;
	let stakersTotalDebt = 0;
	let stakersTotalCollateral = 0;

	holders.forEach(({ collateral, debtEntryAtIndex, initialDebtOwnership }) => {
		let debtBalance =
			((totalIssuedSynths * lastDebtLedgerEntry) / debtEntryAtIndex) * initialDebtOwnership;
		let collateralRatio = debtBalance / collateral / usdToSnxPrice;
		// ignore if 0 balance
		//if (Number(collateral) <= 0) continue;
		if (isNaN(debtBalance)) {
			debtBalance = 0;
			collateralRatio = 0;
		}
		const lockedSnx = collateral * Math.min(1, collateralRatio / issuanceRatio);

		if (Number(debtBalance) > 0) {
			stakersTotalDebt += Number(debtBalance);
			stakersTotalCollateral += Number(collateral * usdToSnxPrice);
		}
		snxTotal += Number(collateral);
		snxLocked += Number(lockedSnx);
	});

	const percentLocked = Number((snxLocked / snxTotal) * 100);
	const activeCollateralizationRatio = Number(
		(1 / (stakersTotalDebt / stakersTotalCollateral)) * 100
	);
	const data = { body: { percentLocked, activeCollateralizationRatio, totalIssuedSynths } };

	yield put({
		type: FETCH_NETWORK_DATA_SUCCESS,
		payload: { data },
	});
}

// EXCHANGE
function* fetchExchangeOpenInterest({ payload: { snxjs } }) {
	const SynthSummaryUtil = new snxjs.ethers.Contract(
		synthSummaryUtilContract.address,
		synthSummaryUtilContract.abi,
		snxjs.contractSettings.provider
	);

	const synthTotalSupplies = yield SynthSummaryUtil.synthsTotalSupplies();

	const unsortedOpenInterest = [];
	for (let i = 0; i < synthTotalSupplies[0].length; i++) {
		unsortedOpenInterest.push({
			name: snxjs.ethers.utils.parseBytes32String(synthTotalSupplies[0][i]),
			totalSupply: Number(snxjs.ethers.utils.formatEther(synthTotalSupplies[1][i])),
			value: Number(snxjs.ethers.utils.formatEther(synthTotalSupplies[2][i])),
		});
	}
	const openInterest = orderBy(unsortedOpenInterest, 'value', 'desc');

	const shortsAndLongs = orderBy(
		openInterest.reduce((acc, curr) => {
			const name = curr.name.slice(1);
			const item =
				curr.name[0] === 'i'
					? {
							name,
							shorts: curr.value,
					  }
					: {
							name,
							longs: curr.value,
					  };
			const existingIndex = acc.findIndex(item => item.name === name);
			if (existingIndex !== -1) {
				acc[existingIndex] = { ...acc[existingIndex], ...item };
			} else {
				acc.push(item);
			}
			return acc;
		}, []),
		'longs',
		'desc'
	);

	yield put({
		type: FETCH_OPEN_INTEREST_SUCCESS,
		payload: { data: { body: { shortsAndLongs, openInterest } } },
	});
}

function* fetchExchangeTradingVolume() {
	const ts = Math.floor(Date.now() / 1e3);
	const oneDayAgo = ts - 3600 * 24;

	const exchanges = yield call(snxData.exchanges.since, { minTimestamp: oneDayAgo });
	const { totalFeesGeneratedInUSD, exchangeUSDTally } = yield call(snxData.exchanges.total);
	const last24Hours = exchanges.reduce((memo, { fromAmountInUSD }) => memo + fromAmountInUSD, 0);
	const data = {
		body: {
			totalFeesGenerated: totalFeesGeneratedInUSD,
			volume: {
				last24Hours,
				total: exchangeUSDTally,
			},
		},
	};

	yield put({
		type: FETCH_TRADING_VOLUME_SUCCESS,
		payload: { data },
	});
}

function* fetchUniswapData({ payload: { snxjs } }) {
	const tickerData = yield call(() =>
		pageResults({
			api: uniswapGraph,
			query: {
				entity: 'exchanges',
				selection: {
					where: {
						tokenSymbol: `\\"sETH\\"`,
						tokenAddress: `\\"${snxjs.sETH.contract.address}\\"`,
					},
				},
				properties: ['id', 'lastPriceUSD', 'ethBalance', 'tokenBalance'],
			},
			max: 1,
		})
	);
	const data = {
		body:
			tickerData && tickerData.length > 0
				? {
						rate: tickerData[0].lastPriceUSD,
						eth: tickerData[0].ethBalance,
						synth: tickerData[0].tokenBalance,
				  }
				: { rate: null, synth: null, eth: null },
	};
	yield put({ type: FETCH_UNISWAP_DATA_SUCCESS, payload: { data } });
}

// MARKETS
function* fetchCurrency(action) {
	try {
		const data = yield call(doFetch, action.url);
		yield put(action.success(data));
	} catch (e) {
		yield put(action.error(e.body));
	}
}

function* fetchSNXCurrencyCall() {
	yield takeEvery(FETCH_SNX_CURRENCY, fetchCurrency);
}

function* fetchNUSDCurrencyCall() {
	yield takeEvery(FETCH_NUSD_CURRENCY, fetchCurrency);
}

function* fetchOpenInterest() {
	yield takeEvery(FETCH_OPEN_INTEREST, fetchExchangeOpenInterest);
}

function* fetchTradingVolume() {
	yield takeEvery(FETCH_TRADING_VOLUME, fetchExchangeTradingVolume);
}

function* fetchUniswapDataCall() {
	yield takeLatest(FETCH_UNISWAP_DATA, fetchUniswapData);
}

function* fetchNetworkData() {
	yield takeLatest(FETCH_NETWORK_DATA, fetchNetworkDataCall);
}

function* fetchNetworkDepot() {
	yield takeLatest(FETCH_NETWORK_DEPOT, fetchNetworkDepotCall);
}

function* fetchNetworkFees() {
	yield takeLatest(FETCH_NETWORK_FEES, fetchNetworkFeesCall);
}

const rootSaga = function*() {
	yield all([
		fetchChartsCall(),
		fetchSNXCurrencyCall(),
		fetchNUSDCurrencyCall(),
		fetchOpenInterest(),
		fetchTradingVolume(),
		fetchUniswapDataCall(),
		fetchNetworkData(),
		fetchNetworkFees(),
		fetchNetworkDepot(),
	]);
};

export default rootSaga;
