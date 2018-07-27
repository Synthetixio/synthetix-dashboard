import React, { Fragment } from "react";
import Chart from "components/Chart";
import { connect } from "react-redux";
import { fetchCharts } from "./actions/charts";
import styles from "./styles";
import SingleStat from "components/SingleStat";
import TopNavBar from "components/TopNavBar";
import { cx } from "emotion";
import { Element } from "react-scroll";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    activeSection: "stats"
  };

  visibleSections = [];

  componentDidMount() {
    this.props.dispatch(fetchCharts());
  }

  onCursorChange = () => {};

  onVisibilityChange = (section, isVisible) => {
    // console.log(section, isVisible);
    // if (isVisible) {
    //   this.visibleSections.push(section);
    // } else {
    //   if (this.visibleSections.length > 1) {
    //     this.visibleSections = this.visibleSections.filter(
    //       el => el !== section
    //     );
    //   }
    // }
    // this.setState({ activeSection: this.visibleSections?.[0] });
    // console.log(this.visibleSections);
  };

  render() {
    const { charts } = this.props;
    const { activeSection } = this.state;

    return (
      <div className={styles.root}>
        <div className="container">
          <div className={cx("is-hidden-touch", styles.lastUpdatedBox)}>
            <label>LAST UPDATED</label> <span>52 MINS AGO</span>{" "}
          </div>
          <TopNavBar selectedSection={activeSection} />
        </div>
        <div className="container main-content">
          <Element name="stats">
            <div className="columns is-multiline">
              <SingleStat
                value={13549045}
                trend={2.4}
                label="HAVVEN MARKET CAP"
                desc="Price of Havven multipled by it’s curiculating supply."
              />
              <SingleStat
                value={0.262}
                trend={2.8}
                label="HAVVEN PRICE"
                desc="Price of Havven multipled by it’s curiculating supply."
              />
              <SingleStat
                value={12026089}
                trend={-6.4}
                label="nUSD MARKET CAP"
                desc="Price of Havven multipled by it’s curiculating supply."
              />
              <SingleStat
                value={1}
                label="nUSD PRICE"
                desc="Price of Havven multipled by it’s curiculating supply."
              />
            </div>
          </Element>
          <Element name="hav">
            <Fragment>
              <div className="columns">
                <div className="column">
                  <Chart
                    info={charts.HavvenPrice}
                    onCursorChange={this.onCursorChange}
                  />
                </div>
              </div>
              <div className="columns">
                <div className="column">Locked Havven Value</div>
                <div className="column">
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio Locked Havven Ratio
                  Locked Havven Ratio Locked Havven Ratio{" "}
                </div>
              </div>
            </Fragment>
          </Element>
          <Element name="nusd">
            <Fragment>
              <div className="columns">
                <div className="column">nUSD Chart</div>
              </div>
              <div className="columns">
                <div className="column">Total Fees</div>
                <div className="column">
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization Ratio
                  Collateralization Ratio Collateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization
                  RatioCollateralization RatioCollateralization Ratio
                </div>
              </div>
            </Fragment>
          </Element>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { charts } = state;

  return {
    charts
  };
};

const ConnectedApp = connect(mapStateToProps)(App);
export default ConnectedApp;
