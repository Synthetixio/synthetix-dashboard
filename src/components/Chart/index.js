import React, { View, Text } from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import { Col, Container, Row } from "react-grid-system";
import {
  VictoryChart,
  VictoryCursorContainer,
  VictoryAxis,
  Line,
  VictoryScatter,
  VictoryLine,
  VictoryArea,
} from "victory";
import moment from "moment";
const CURRENCY_MAP = ["Usd", "Btc", "Eth"];
const width = 600;

export default class HavvenChart extends React.Component {
  constructor(props) {
    super(props);

    const currencyIndex = props.currencyIndex || 0;

    this.state = {
      overlayWidth: 0,
      timeSeries: [],
      timeSeriesX: [],
      showScatter: false,
      currencyIndex: currencyIndex,
      showChart: false,
      tickerLabelPadding: 48
    };
  }

  onCursorChange = (value, props) => {
    if (value) {
      const { timeSeries, timeSeriesX } = this.state;
      const index = this.findIndexByDate(timeSeriesX, value);
      if (index > -1) {
        const scatterY = timeSeries[index].y;

        this.setState({
          scatterX: value,
          scatterY,
          overlayWidth: width / timeSeriesX.length * (index + 1)
        });
        this.props.onCursorChange &&
          this.props.onCursorChange(scatterY, timeSeries[index].x);
      }
    }
  };

  onTouchEnd = () => {
    this.setScatterToLast();
  };

  onTouchStart = d => {
    this.onCursorChange(d);
  };

  setScatterToLast = () => {
    const { timeSeriesX, timeSeries } = this.state;
    const length = timeSeriesX.length;
    const index = length > 0 ? length - 1 : length;

    if (index !== -1 && index !== undefined) {
      this.setState({
        scatterX: timeSeries[index].x,
        scatterY: timeSeries[index].y,
        overlayWidth: width / timeSeriesX.length * (index + 1),
        showScatter: true,
        showChart: true
      });
      this.props.onCursorChange &&
        this.props.onCursorChange(timeSeries[index].y, timeSeries[index].x);
    }
  };

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

  parseProps = props => {
    const { info } = props;
    if (!info || !info.displayName) return;

    let { currencyIndex = 0 } = this.props;
    const currency = CURRENCY_MAP[currencyIndex];
    const data = info;
    const minValue = data && data["minValue" + currency];
    const maxValue = data && data["maxValue" + currency];
    const fromDate = data && new Date(data.fromDate);
    const toDate = data && new Date(data.toDate);

    const timeSeries =
      data &&
      data["timeSeries" + currency].map(val => ({
        x: new Date(val.x),
        y: val.y
      }));
    const timeSeriesX = data && data.timeSeriesX.map(val => new Date(val));
    //const tickerLabelPadding = props.tickerLabelPaddings ? props.tickerLabelPaddings[currencyIndex] : tickerLabelPaddings[currencyIndex];

    this.setState(
      {
        minValue,
        maxValue,
        fromDate,
        toDate,
        timeSeries,
        timeSeriesX,
        currencyIndex
        //tickerLabelPadding: tickerLabelPadding,
      },
      () => {
        this.setScatterToLast();
      }
    );
  };

  render() {
    const { timeSeries } = this.state;

    return (
      <div className={styles.container}>
        <h1>Havven Chart</h1>
        <Container>
          <Row>
            <div>
              <svg style={{ height: 0 }}>
                <defs>
                  <linearGradient x1="55.1525017%" y1="-5.72462792%" x2="55.1524997%" y2="100%" id="linearGradient-1">
                    <stop stop-color="#53B167" stop-opacity="0.309669384" offset="0%"></stop>
                    <stop stop-color="#53B167" stop-opacity="0" offset="100%"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <VictoryChart
                scale={{ x: "time" }}
                containerComponent={
                  <VictoryCursorContainer
                    cursorDimension={"x"}
                    cursorComponent={<Line style={{ stroke: "transparent" }} />}
                    onCursorChange={this.onCursorChange}
                    onTouchStart={d => this.onTouchStart(d)}
                    onTouchEnd={() => this.onTouchEnd()}
                  />
                }
              >
                <VictoryAxis
                  style={{
                    grid: { stroke: "transparent" },
                    axis: { stroke: "transparent" }
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

                <VictoryArea
                  data={timeSeries}
                  style={{
                    data: {fill: "url(#linearGradient-1)"}
                  }}

                />
                {this.state.showScatter && (
                  <VictoryScatter
                    data={[
                      {
                        x: this.state.scatterX,
                        y: this.state.scatterY,
                        symbol: "circle",
                        size: 7
                      }
                    ]}
                  />
                )}
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
};
