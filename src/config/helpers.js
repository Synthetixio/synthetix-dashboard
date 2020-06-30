import { call } from 'redux-saga/effects';
import { pageResults } from 'synthetix-data';

import { uniswapGraph } from './sagas';

export function* getExchangeDataHelper({
	exchangeAddress,
	timestampLt,
	timestampGt,
	maxResults: maxResults = 1000,
	maxTries: maxTries = 0,
	tried: tried = 0,
	oldData: oldData = [],
}) {
	const where = { exchangeAddress: `\\"${exchangeAddress}\\"` };
	if (timestampLt) {
		where.timestamp_lt = timestampLt;
	}
	if (timestampGt) {
		where.timestamp_gt = timestampGt;
	}
	const data = yield call(() =>
		pageResults({
			api: uniswapGraph,
			query: {
				entity: 'exchangeHistoricalDatas',
				selection: {
					orderBy: 'timestamp',
					orderDirection: 'desc',
					where,
				},
				properties: [
					'id',
					'timestamp',
					'tradeVolumeEth',
					'tradeVolumeUSD',
					'tradeVolumeToken',
					'tokenPriceUSD',
					'ethBalance',
					'tokenBalance',
				],
			},
			max: maxResults,
		})
	);

	const newData = oldData.length > 0 ? [...oldData, ...data] : data;

	if (maxTries > tried && data && data.length > 0 && data.length === maxResults) {
		return yield* getExchangeDataHelper({
			exchangeAddress,
			timestampLt: data[data.length - 1].timestamp,
			timestampGt,
			maxResults,
			maxTries,
			tried: tried + 1,
			oldData: newData,
		});
	}
	return newData;
}

// NOTE we are not grabbing historical data past 30 days right now
const SNX_CONTRACT_LIST = [
	'0x3958b4ec427f8fa24eb60f42821760e88d485f7f', // latest
	// '0x9faa0cb10912de7ad1d86705c65de291a9088a61', // 8/7/19 - 7/9/19
	// '0x8da198a049426bfcf1522b0dc52f84beda6e38ff', // 7/9/19 - 5/29/19
	// '0xd9025ed64baa7b9046e37fe94670c79fccb2b5c8', // 5/27/19 - 5/21-19
	// '0x5d8888a212d033cff5f2e0ac24ad91a5495bad62', // 5/2/19 - 2/26/19
];

const SUSD_CONTRACT_LIST = [
	'0xb944d13b2f4047fc7bd3f7013bcf01b115fb260d', // latest - 9/29/19
	// '0xa1ecdcca26150cf69090280ee2ee32347c238c7b', // 9/25/19 - 2/26/29
];

export function* getUniswapSusdData(timestampGt) {
	return yield* getExchangeDataHelper({
		exchangeAddress: SUSD_CONTRACT_LIST[0],
		maxTries: 10000,
		timestampGt,
	});
}

export function* getUniswapSnxData(timestampGt) {
	return yield* getExchangeDataHelper({
		exchangeAddress: SNX_CONTRACT_LIST[0],
		maxTries: 10000,
		timestampGt,
	});
}

export const synthSummaryUtilContract = {
	address: '0x88C450a651ac1AaEEee6cFADa225e34a67892Ccf',
	abi: [
		{
			constant: true,
			inputs: [
				{
					name: 'account',
					type: 'address',
				},
				{
					name: 'currencyKey',
					type: 'bytes32',
				},
			],
			name: 'totalSynthsInKey',
			outputs: [
				{
					name: 'total',
					type: 'uint256',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthsRates',
			outputs: [
				{
					name: '',
					type: 'bytes32[]',
				},
				{
					name: '',
					type: 'uint256[]',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthsTotalSupplies',
			outputs: [
				{
					name: '',
					type: 'bytes32[]',
				},
				{
					name: '',
					type: 'uint256[]',
				},
				{
					name: '',
					type: 'uint256[]',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'exchangeRates',
			outputs: [
				{
					name: '',
					type: 'address',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'synthetix',
			outputs: [
				{
					name: '',
					type: 'address',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [
				{
					name: 'account',
					type: 'address',
				},
			],
			name: 'synthsBalances',
			outputs: [
				{
					name: '',
					type: 'bytes32[]',
				},
				{
					name: '',
					type: 'uint256[]',
				},
				{
					name: '',
					type: 'uint256[]',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'frozenSynths',
			outputs: [
				{
					name: '',
					type: 'bytes32[]',
				},
			],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{
					name: '_synthetix',
					type: 'address',
				},
				{
					name: '_exchangeRates',
					type: 'address',
				},
			],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
	],
};
