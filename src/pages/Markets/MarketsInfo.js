import React from 'react';
import { Link } from 'react-router-dom';
import numeral from 'numeral';

import differenceInMins from 'date-fns/difference_in_minutes';

import TopNavBar from '../../components/TopNavBar';
import SingleStatBox from '../../components/SingleStatBox';

export const MarketsInfo = props => {
	let minsAgo = differenceInMins(Date.now(), props.lastUpdated);
	minsAgo = isNaN(minsAgo) ? '-' : minsAgo;
	const cssAfterLoad = 'html {transition: all 1s ease}';
	const { market_cap, percent_change_24h, volume_24h, price } = props.currency.quote.USD;
	const { circulating_supply, total_supply } = props.currency;

	return (
		<div className="dashboard-root markets">
			<TopNavBar />
			<div className="container main-content markets">
				<h2 className="markets__ttl">
					{props.currencyType}
					<div className="markets-price">
						<span className={`markets-price-value ${percent_change_24h < 0 ? 'is-negative' : ''}`}>
							{numeral(price).format('$0,(0).0000')}
						</span>
						<sub>USD</sub>{' '}
						<div>
							{' '}
							<span className={`percent ${percent_change_24h < 0 ? 'is-negative' : ''}`}>
								{percent_change_24h >= 0 ? '+' : ''}
								{numeral(percent_change_24h).format('$0,(0).00')}%
							</span>
						</div>
					</div>
				</h2>
				<button type="button" className="markets-btn">
					<Link to={props.toggleCurrencyUrl}>{props.toggleCurrencyType}</Link>
				</button>
				<div className="columns is-multiline" id="stats">
					<SingleStatBox
						value={market_cap}
						label={`${props.currencyType} MARKET CAP`}
						decimals={0}
						customClass={true}
						symbol="USD"
						isSmall={true}
					/>

					<SingleStatBox
						value={volume_24h}
						label="VOLUME (24h)"
						customClass={true}
						symbol="USD"
						isSmall={true}
					/>

					<SingleStatBox
						value={circulating_supply}
						label="Circulating Supply"
						customClass={true}
						symbol={props.currencyType}
						type="number"
						decimals={0}
						isSmall={true}
					/>

					<SingleStatBox
						value={total_supply}
						label="Total Supply"
						customClass={true}
						symbol={props.currencyType}
						type="number"
						decimals={0}
						isSmall={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default MarketsInfo;
