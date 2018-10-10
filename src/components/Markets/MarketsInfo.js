import React from "react";
import { Link } from 'react-router-dom'

import differenceInMins from 'date-fns/difference_in_minutes';


import TopNavBar from '../TopNavBar';
import SingleStatBox from '../SingleStatBox';


export const MarketsInfo = props => {

    let minsAgo = differenceInMins(Date.now(), props.lastUpdated);
    minsAgo = isNaN(minsAgo) ? '-' : minsAgo;
    const cssAfterLoad = 'html {transition: all 1s ease}';
    const { market_cap, percent_change_1h, volume_24h, price } = props.currency.quotes.USD;
    const { circulating_supply, total_supply } = props.currency;
    const percent = percent_change_1h > 0 
    ? <span className="percent">(+{percent_change_1h}%)</span>
    : <span className="percent">({percent_change_1h}%)</span>;

    return (
        <div className="dashboard-root markets">
            <div className="is-hidden-mobile last-updated-top">
                <label>LAST UPDATED</label> <span>{ minsAgo } MINS AGO</span>{' '}
            </div>
            <TopNavBar/>
            <div className="container main-content markets">
                <h2 className="markets__ttl">{ props.currencyType }
                    <div className="markets-price">${ price } <sub>USD</sub> <div>{ percent }</div> </div>
                </h2>
                <button type="button" className="markets-btn">
                    <Link to={props.toggleCurrencyUrl}>{props.toggleCurrencyType}</Link>
                </button>
                <div className="columns is-multiline" id="stats">
                    <SingleStatBox
                        value={ market_cap }
                        label="HAVVEN MARKET CAP"
                        decimals={0}
                        customClass={ true }
                        symbol="USD"
                    />

                    <SingleStatBox
                        value={ volume_24h }
                        label="VOLUME (24h)"
                        customClass={ true }
                        symbol="USD"
                    />


                    <SingleStatBox
                        value={ circulating_supply }
                        label="Circulating Supply"
                        customClass={ true }
                        symbol="nUSD"
                    />

                    <SingleStatBox
                        value={ total_supply }
                        label="Total Supply"
                        customClass={ true }
                        symbol="nUSD"
                    />
                </div>
            </div>
        </div>
    )
}

export default MarketsInfo;
