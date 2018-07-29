import React from "react";
import { cx } from "emotion";
import PropTypes from "prop-types";
import { Link } from "react-scroll";

export default class TopNavBar extends React.Component {
  static propTypes = {
    selectedSection: PropTypes.string
  };

  state = {
    isOpen: false,
    section: "stats"
  };

  onSetActive = section => {
    this.setState({ section: section });
  };

  render() {
    const { isOpen, section } = this.state;
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <a className="navbar-item" href="https://havven.io">
              <svg width="73px" height="29px" viewBox="0 0 73 29">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    id="logo"
                    transform="translate(-35.000000, -37.000000)"
                    fill="#FFFFFF"
                    fillRule="nonzero"
                  >
                    <g id="Nav" transform="translate(35.000000, 37.000000)">
                      <g transform="translate(0.000000, 0.406250)">
                        <path d="M31.3882138,0 L35.8541381,11.1224043 L40.4386431,0 L43.0594845,0 L35.8541381,17.2136277 L28.7290697,0 L31.3882138,0 Z M31.3882138,10.8609794 L35.8541381,21.9833837 L40.4386431,10.8609794 L43.0594845,10.8609794 L35.8541381,28.074607 L28.7290697,10.8609794 L31.3882138,10.8609794 Z M0.0177264246,10.8795906 L2.52308331,10.8795906 L2.52308331,17.359516 L9.53801593,17.359516 L9.53801593,10.8795906 L12.0690295,10.8795906 L12.0690295,27.3703804 L9.53801593,27.3703804 L9.53801593,19.716077 L2.52308331,19.716077 L2.52308331,27.3703804 L0.0177264246,27.3703804 L0.0177264246,11.0210096 L0.0177264246,10.8795906 Z M14.1117001,27.3485672 L22.2304025,9.8953277 L30.0633497,27.3485672 L27.3823946,27.3485672 L25.6791917,23.4151177 L18.6092805,23.4151177 L16.7993193,27.3485672 L14.1117001,27.3485672 Z M19.6638028,21.0247364 L24.6257356,21.0247364 L22.2290697,15.3267513 L19.6638028,21.0247364 Z M45.7480367,10.9107429 L54.8050401,10.9107429 L54.8050401,13.2234105 L48.1952829,13.2234105 L48.1952829,17.1736701 L54.6126484,17.1736701 L54.6126484,19.5650521 L48.1952829,19.5650521 L48.1952829,25.0054144 L54.8050401,25.0054144 L54.8050401,27.3687794 L45.7480367,27.3687794 L45.7480367,10.9107429 Z M58.1362751,27.3412294 L58.1362751,9.78419372 L70.0794871,22.326058 L70.0794871,10.8529745 L72.6002378,10.8529745 L72.6002378,28.4680454 L60.5769239,15.9052351 L60.5769239,27.3412294 L58.1362751,27.3412294 Z" />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              {/*<img src={logo} alt="Havven" width="73" height="29" />*/}
            </a>

            <a
              role="button"
              className={cx("navbar-burger", { "is-active": isOpen })}
              aria-label="menu"
              aria-expanded="false"
              onClick={() => this.setState({ isOpen: !isOpen })}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>
          <div className="is-hidden-tablet mobile-nav-section">
            <div className="level is-mobile">
              <div className="level-left">
                <Link
                  href="javascript:void(0)"
                  to="stats"
                  className={cx({ "is-active": section === "stats" })}
                  onSetActive={this.onSetActive}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-120}
                >
                  STATS
                </Link>
              </div>
              <Link
                href="javascript:void(0)"
                to="hav"
                className={cx({ "is-active": section === "hav" })}
                onSetActive={this.onSetActive}
                spy={true}
                smooth={true}
                duration={500}
                offset={-120}
              >
                HAV
              </Link>
              <div className="level-left">
                <Link
                  href="javascript:void(0)"
                  to="nusd"
                  className={cx({ "is-active": section === "nusd" })}
                  onSetActive={this.onSetActive}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-120}
                >
                  nUSD
                </Link>
              </div>
            </div>
          </div>
          <div
            className={cx("navbar-menu", {
              "is-active": isOpen
            })}
          >
            <div className="navbar-end">
              <a className="navbar-item">Team</a>
              <a className="navbar-item">Blog</a>
              <a className="navbar-item">Whitepaper</a>
              <a className="navbar-item is-active">Dashboard</a>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
