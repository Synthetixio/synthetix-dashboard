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

  componentDidMount() {
    this.parseProps(this.props);
  }

  parseProps = (props) => {


  }

  render() {
    const {timeSeries} = this.state;

    return (
      <div className={styles.container}>
        <h1>Havven Chart</h1>
        <div>
          {/*<button onClick={() => dashboard.loadData()}>Reload</button>*/}
        </div>
        {/*{dashboard.isLoading && <div>Loading...</div>}*/}
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
