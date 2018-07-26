import React, {View, Text} from "react";
import PropTypes from 'prop-types';
import styles from "./styles";
import { Col, Container, Row } from "react-grid-system";
import { VictoryChart, VictoryCursorContainer, VictoryAxis, Line, VictoryScatter, VictoryLine } from 'victory';
import moment from 'moment';
const CURRENCY_MAP = ['Usd', 'Btc', 'Eth'];


export default class HavvenChart extends React.Component {

  constructor(props){

    super(props);
    this.state={
      timeSeries: [],
      timeSeriesX: [],
      showScatter: false,
      showChart:false,
    };

  }

  onCursorChange = (value, props) => {}

  onTouchEnd = () => {}

  onTouchStart= (d) => {
    this.onCursorChange(d);
  }

  setScatterToLast = () => {};

  findIndexByDate(dateArray, date) {
    for (let i = 0; i < dateArray.length - 1; i++) {
      if (date >= dateArray[i] && date <= dateArray[i + 1]) {
        return i;
      }
    }
  }

  componentDidMount() {

    this.parseProps(this.props);

  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    let initialData = this.props.info && !prevProps.info;

    let differentChartData =
      this.props.info &&
      prevProps.info &&
      (this.props.info.displayName !== prevProps.info.displayName ||
        this.props.currencyIndex !== prevProps.currencyIndex);

    if (initialData || differentChartData) {
      this.parseProps(this.props);
    }

  }

  parseProps = (props) => {

    const {info} = props;
    if (!info || !info.displayName) return;

    let { currencyIndex = 0 } = this.props;
    const currency = CURRENCY_MAP[currencyIndex];
    const data = info;
    const minValue = data && data['minValue' + currency];
    const maxValue = data && data['maxValue' + currency];
    const fromDate = data && new Date(data.fromDate);
    const toDate = data && new Date(data.toDate);

    const timeSeries = data && data['timeSeries' + currency].map(val => ({x: new Date(val.x), y: val.y}));
    const timeSeriesX = data && data.timeSeriesX.map(val => new Date(val));
    //const tickerLabelPadding = props.tickerLabelPaddings ? props.tickerLabelPaddings[currencyIndex] : tickerLabelPaddings[currencyIndex];

    this.setState({
      minValue,
      maxValue,
      fromDate,
      toDate,
      timeSeries,
      timeSeriesX,
      currencyIndex,
      //tickerLabelPadding: tickerLabelPadding,
    }, ()=>{this.setScatterToLast()});

  }

  render() {
    const {timeSeries} = this.state;

    return (
      <div className={styles.container}>
        <h1>Havven Chart</h1>
        <Container>
          <Row>
            <div>
              <VictoryChart
                scale={{ x: "time" }}
                containerComponent={
                  <VictoryCursorContainer
                    cursorDimension={"x"}
                    cursorComponent={<Line style={{ stroke: "transparent" }} />}
                    onCursorChange={this.onCursorChange}
                    onTouchStart={(d) => this.onTouchStart(d)}
                    onTouchEnd={() => this.onTouchEnd()}
                  />
                }
              >
                <VictoryAxis
                  style={{
                    grid: { stroke: "transparent" },
                    axis: { stroke: "transparent" },
                  }}
                  tickCount={3}
                  tickFormat={t => `${moment(t).format("DD/MM")}`}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: { stroke: "transparent" }
                  }}
                />

                <VictoryLine data={timeSeries} />

              </VictoryChart>

            </div>

            {/*{dashboard.havvenPrice.map((el: DataItem, idx) => (*/}
              {/*<Col sm={2} key={idx} className={styles.box}>*/}
                {/*<div>USD Value: {el.usdValue}</div>*/}
                {/*<div>ETH Value: {el.ethValue}</div>*/}
                {/*<div>BTC Value: {el.btcValue}</div>*/}
                {/*<div>Date: {el.created}</div>*/}
              {/*</Col>*/}
            {/*))}*/}
          </Row>
        </Container>

      </div>
    );
  }
}

HavvenChart.propTypes = {
  charts: PropTypes.object
}
