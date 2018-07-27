import React from "react";
import styles from "./styles";
import { cx } from "emotion";
import logo from "resources/havven-logo.svg";
import PropTypes from "prop-types";
import { Link } from "react-scroll";

export default class TopNavBar extends React.Component {
  static propTypes = {
    selectedSection: PropTypes.string
  };

  state = {
    isOpen: false
  };

  // scrollTo(section) {
  //   scroller.scrollTo(section, {
  //     duration: 800,
  //     delay: 0,
  //     smooth: "easeInOutQuart",
  //     offset: -110
  //   });
  // }

  render() {
    const { isOpen } = this.state;
    const { selectedSection } = this.props;
    return (
      <nav
        className={cx("navbar", styles.navBar)}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="navbar-item" href="https://havven.io">
            <img src={logo} alt="Havven" width="73" height="29" />
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
        <div className={cx("is-hidden-desktop", styles.mobileNavSections)}>
          <div className="level is-mobile">
            <div className="level-left">
              <Link
                href="javascript:void(0)"
                to="stats"
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
              spy={true}
              smooth={true}
              duration={500}
              offset={-100}
            >
              HAV
            </Link>
            <div className="level-left">
              <Link
                href="javascript:void(0)"
                to="nusd"
                spy={true}
                smooth={true}
                duration={500}
                offset={-100}
              >
                nUSD
              </Link>
            </div>
          </div>
        </div>
        <div
          className={cx("navbar-menu", styles.navBarMenu, {
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
      </nav>
    );
  }
}
