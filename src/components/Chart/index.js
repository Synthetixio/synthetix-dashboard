import React, { View, Text } from 'react';
import PropTypes from 'prop-types';
import {
  VictoryChart,
  VictoryCursorContainer,
  VictoryAxis,
  Line,
  VictoryScatter,
  VictoryLine,
  VictoryArea,
  VictoryTooltip,
} from 'victory';
import GraphTooltip from '../Tooltip';
import format from 'date-fns/format';
import havvenTheme from '../../config/theme';
const CURRENCY_MAP = ['Usd', 'Btc', 'Eth'];
const LINE_COLOR = {
  yellow: '#D9AB44',
  red: '#F02D2D',
  green: '#53B167',
  purple: '#42217E',
};

export default class HavvenChart extends React.Component {
  constructor(props) {
    super(props);

    const currencyIndex = props.currencyIndex || 0;
    const colorGradient = props.colorGradient || 'green';
    //const periodSwitch = props.periodSwitch || "ALL";

    this.state = {
      timeSeries: [],
      timeSeriesX: [],
      showScatter: false,
      currencyIndex: currencyIndex,
      showChart: false,
      tickerLabelPadding: 48,
      windowWidth: this.getWidth(),
      gradientUrl: `url(#gradient-${colorGradient})`,
      colorGradient,
      decimals: {},
      switchOnCount: this.countSwitchOn(),
    };
  }

  getWidth = () => {
    const w = window.innerWidth;
    const r = w > 1350 ? 1350 : w;
    return r < 769 ? r : this.props.fullSize ? r : r / 2;
  };

  onCursorChange = (value, props) => {
    if (value) {
      const {
        timeSeries,
        timeSeriesX,
        timeSeriesBtc,
        timeSeriesEth,
      } = this.state;
      const index = this.findIndexByDate(timeSeriesX, value);
      if (index > -1) {
        const scatterY = timeSeries[index].y;

        if (this.props.currencySwitch) {
          const scatterYBtc = timeSeriesBtc[index].y;
          const scatterYEth = timeSeriesEth[index].y;

          this.setState({
            scatterX: value,
            scatterY,
            scatterYBtc,
            scatterYEth,
          });
        } else {
          this.setState({
            scatterX: value,
            scatterY,
          });
        }
      }
    }
  };

  setScatterToLast = () => {
    const { timeSeriesX, timeSeries } = this.state;
    const length = timeSeriesX.length;
    const index = length > 0 ? length - 1 : length;

    if (index !== -1 && index !== undefined) {
      this.setState({
        scatterX: timeSeries[index].x,
        scatterY: timeSeries[index].y,
        //showScatter: true,
        showChart: true,
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

  updateDimensions = () => {
    this.setState({ windowWidth: this.getWidth() });
  };

  componentDidMount() {
    this.parseProps(this.props);
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let initialData = this.props.info && !prevProps.info;

    let differentChartData =
      this.props.info &&
      prevProps.info &&
      (this.props.info.displayName !== prevProps.info.displayName ||
        this.props.currencyIndex !== prevProps.currencyIndex);

    let freshChartData = prevProps.lastUpdated !== this.props.lastUpdated;

    let periodChanged = prevProps.period !== this.props.period;

    if (initialData || differentChartData || freshChartData || periodChanged) {
      this.parseProps(this.props);
    }

    const { currencySwitch } = this.props;
    if (currencySwitch && prevProps.currencySwitch !== currencySwitch) {
      const count = this.countSwitchOn();
      const hideScatter = count === 0;
      this.setState({
        showScatter: !hideScatter,
        switchOnCount: count,
      });
    }
  }

  countSwitchOn = () => {
    let count = 0;
    const { currencySwitch } = this.props;
    if (currencySwitch) {
      for (let key in currencySwitch) {
        if (currencySwitch.hasOwnProperty(key)) {
          if (currencySwitch[key] === true) count++;
        }
      }
    }
    return count;
  };

  parseProps = props => {
    const { info, currencySwitch } = props;
    if (!info || !info.displayName) return;
    let timeSeriesBtc,
      timeSeriesEth,
      minValueBtc,
      maxValueBtc,
      minValueEth,
      maxValueEth;

    let { currencyIndex = 0 } = this.props;
    const currency = CURRENCY_MAP[currencyIndex];
    const data = info;
    const minValue = data && data['minValue' + currency];
    const maxValue = data && data['maxValue' + currency];
    const fromDate = data && new Date(data.fromDate);
    const toDate = data && new Date(data.toDate);

    const timeSeries =
      data &&
      data['timeSeries' + currency].map(val => ({
        x: new Date(val.x),
        y: val.y,
      }));
    const timeSeriesX = data && data.timeSeriesX.map(val => new Date(val));

    if (currencySwitch) {
      timeSeriesBtc =
        data &&
        data['timeSeriesBtc'].map(val => ({
          x: new Date(val.x),
          y: val.y,
        }));
      minValueBtc = data && data['minValueBtc'];
      maxValueBtc = data && data['maxValueBtc'];

      timeSeriesEth =
        data &&
        data['timeSeriesEth'].map(val => ({
          x: new Date(val.x),
          y: val.y,
        }));
      minValueEth = data && data['minValueEth'];
      maxValueEth = data && data['maxValueEth'];
    }

    // if (this.props.info.displayName === "HavvenPrice") {
    //   console.log(this.props.info);
    // }

    this.setState(
      {
        minValue,
        maxValue,
        minValueBtc,
        maxValueBtc,
        minValueEth,
        maxValueEth,
        fromDate,
        toDate,
        timeSeries,
        timeSeriesEth,
        timeSeriesBtc,
        timeSeriesX,
        currencyIndex,
      },
      () => {
        this.setScatterToLast();
      }
    );
  };

  cursorOut = event => {
    event.stopPropagation();
    this.setState({ showScatter: false });
  };

  cursorOver = event => {
    event.stopPropagation();
    this.setState({ showScatter: true });
  };

  render() {
    const {
      timeSeries,
      timeSeriesBtc,
      timeSeriesEth,
      minValue,
      maxValue,
      minValueBtc,
      maxValueBtc,
      minValueEth,
      maxValueEth,
      switchOnCount,
    } = this.state;
    const { currencySwitch, period } = this.props;
    const dtFormat = period === '1D' ? 'HH:00' : 'DD/MM';

    let ttY = -100;
    if (switchOnCount) {
      ttY -= switchOnCount * 15;
    }

    return (
      <div>
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient
              x1="55.1525017%"
              y1="-5.72462792%"
              x2="55.1524997%"
              y2="100%"
              id="gradient-green"
            >
              <stop
                stop-color="#53B167"
                stop-opacity="0.309669384"
                offset="0%"
              />
              <stop stop-color="#53B167" stop-opacity="0" offset="100%" />
            </linearGradient>

            <linearGradient
              x1="55.1525017%"
              y1="-5.72462792%"
              x2="55.1524997%"
              y2="100%"
              id="gradient-yellow"
            >
              <stop
                stop-color="#D9AB44"
                stop-opacity="0.499971694"
                offset="0%"
              />
              <stop stop-color="#D9AB44" stop-opacity="0" offset="100%" />
            </linearGradient>

            <linearGradient
              x1="50%"
              y1="0.952854046%"
              x2="50%"
              y2="97.9791366%"
              id="gradient-red"
            >
              <stop
                stop-color="#E02254"
                stop-opacity="0.601364357"
                offset="0%"
              />
              <stop stop-color="#E5255D" stop-opacity="0" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="55.1525017%"
              y1="-5.72462792%"
              x2="55.1524997%"
              y2="100%"
              id="gradient-purple"
            >
              <stop
                stop-color="#42217E"
                stop-opacity="0.309669384"
                offset="0%"
              />
              <stop stop-color="#42217E" stop-opacity="0" offset="100%" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'relative' }}>
          {this.props.currencySwitch &&
            this.props.currencySwitch['Btc'] && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <VictoryChart
                  domain={{ y: [minValueBtc * 0.9, maxValueBtc * 1.1] }}
                  scale={{ x: 'time' }}
                  padding={{ bottom: 40 }}
                  theme={havvenTheme}
                  domainPadding={{ y: [0, 20] }}
                  width={this.state.windowWidth}
                >
                  <VictoryAxis
                    style={{
                      grid: { stroke: 'transparent' },
                      axis: { stroke: 'transparent' },
                    }}
                    tickCount={5}
                    tickFormat={t => `${format(t, dtFormat)}`}
                  />

                  <VictoryArea
                    data={timeSeriesBtc}
                    style={{
                      data: { fill: 'url(#gradient-yellow' },
                    }}
                  />
                  <VictoryLine
                    data={timeSeriesBtc}
                    style={{
                      data: { stroke: '#D9AB44', strokeWidth: 2 },
                    }}
                  />
                  {this.state.showScatter && (
                    <VictoryScatter
                      data={[
                        {
                          x: this.state.scatterX,
                          y: this.state.scatterYBtc,
                          symbol: 'circle',
                          size: 3,
                        },
                      ]}
                    />
                  )}
                </VictoryChart>
              </div>
            )}
          {this.props.currencySwitch &&
            this.props.currencySwitch['Eth'] && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <VictoryChart
                  domain={{ y: [minValueEth * 0.9, maxValueEth * 1.1] }}
                  scale={{ x: 'time' }}
                  padding={{ bottom: 40 }}
                  theme={havvenTheme}
                  domainPadding={{ y: [0, 20] }}
                  width={this.state.windowWidth}
                >
                  <VictoryAxis
                    style={{
                      grid: { stroke: 'transparent' },
                      axis: { stroke: 'transparent' },
                    }}
                    tickCount={5}
                    tickFormat={t => `${format(t, dtFormat)}`}
                  />

                  <VictoryArea
                    data={timeSeriesEth}
                    style={{
                      data: { fill: 'url(#gradient-purple' },
                    }}
                  />
                  <VictoryLine
                    data={timeSeriesEth}
                    style={{
                      data: { stroke: '#42217E', strokeWidth: 2 },
                    }}
                  />
                  {this.state.showScatter && (
                    <VictoryScatter
                      data={[
                        {
                          x: this.state.scatterX,
                          y: this.state.scatterYEth,
                          symbol: 'circle',
                          size: 3,
                        },
                      ]}
                    />
                  )}
                </VictoryChart>
              </div>
            )}
          {((this.props.currencySwitch && this.props.currencySwitch['Usd']) ||
            !this.props.currencySwitch) && (
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
              <VictoryChart
                domain={{ y: [minValue * 0.9, maxValue * 1.1] }}
                scale={{ x: 'time' }}
                padding={{ bottom: 40 }}
                theme={havvenTheme}
                domainPadding={{ y: [0, 20] }}
                width={this.state.windowWidth}
              >
                <VictoryAxis
                  style={{
                    grid: { stroke: 'transparent' },
                    axis: { stroke: 'transparent' },
                  }}
                  tickCount={5}
                  tickFormat={t => `${format(t, dtFormat)}`}
                />

                <VictoryArea
                  data={timeSeries}
                  style={{
                    data: { fill: this.state.gradientUrl },
                  }}
                />
                <VictoryLine
                  data={timeSeries}
                  style={{
                    data: {
                      stroke:
                        (this.props.colorGradient &&
                          LINE_COLOR[this.props.colorGradient]) ||
                        LINE_COLOR['red'],
                      strokeWidth: 2,
                    },
                  }}
                />

                {this.state.showScatter && (
                  <VictoryScatter
                    data={[
                      {
                        x: this.state.scatterX,
                        y: this.state.scatterY,
                        symbol: 'circle',
                        size: 5,
                      },
                    ]}
                  />
                )}
              </VictoryChart>
            </div>
          )}
          <div onMouseOut={this.cursorOut} onMouseOver={this.cursorOver}>
            <VictoryChart
              domain={{ y: [minValue * 0.9, maxValue * 1.1] }}
              scale={{ x: 'time' }}
              padding={{ bottom: 40 }}
              theme={havvenTheme}
              domainPadding={{ y: [0, 20] }}
              width={this.state.windowWidth}
              containerComponent={
                <VictoryCursorContainer
                  cursorDimension={'x'}
                  cursorComponent={<Line style={{ stroke: 'transparent' }} />}
                  onCursorChange={this.onCursorChange}
                  cursorLabel={() => ''}
                  cursorLabelOffset={{ x: -85, y: ttY }}
                  cursorLabelComponent={
                    <VictoryTooltip
                      flyoutComponent={
                        <GraphTooltip
                          period={this.props.period}
                          showScatter={this.state.showScatter}
                          scatterY={
                            currencySwitch && !currencySwitch.Usd
                              ? undefined
                              : this.props.formatTooltip
                                ? this.props.formatTooltip(this.state.scatterY)
                                : this.state.scatterY
                          }
                          scatterX={this.state.scatterX}
                          scatterYBtc={
                            currencySwitch &&
                            currencySwitch.Btc &&
                            this.state.scatterYBtc
                          }
                          scatterYEth={
                            currencySwitch &&
                            currencySwitch.Eth &&
                            this.state.scatterYEth
                          }
                          decimals={this.props.decimals}
                          sign={this.props.sign}
                        />
                      }
                    />
                  }
                />
              }
            >
              <VictoryAxis
                style={{
                  grid: { stroke: 'transparent' },
                  axis: { stroke: 'transparent' },
                }}
                tickCount={5}
                tickFormat={t => `${format(t, dtFormat)}`}
              />

              <VictoryLine
                data={timeSeries}
                style={{
                  data: {
                    stroke: 'transparent',
                    strokeWidth: 2,
                  },
                }}
              />

              {this.state.showScatter && (
                <VictoryLine
                  style={{
                    data: { stroke: 'rgba(255,255,255,0.15)' },
                  }}
                  data={[
                    { x: this.state.scatterX, y: minValue * 0.9 },
                    { x: this.state.scatterX, y: maxValue * 1.1 },
                  ]}
                />
              )}
            </VictoryChart>
          </div>
        </div>
      </div>
    );
  }
}

HavvenChart.propTypes = {
  charts: PropTypes.object,
};
