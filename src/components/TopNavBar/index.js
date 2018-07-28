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
    isOpen: false,
    section: "stats"
  };

  onSetActive = section => {
    this.setState({ section: section });
  };

  render() {
    const { isOpen, section } = this.state;
    return (
      <nav
        className={cx("navbar", styles.navBar)}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
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
          <div className={cx("is-hidden-tablet", styles.mobileNavSections)}>
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
        </div>
      </nav>
    );
  }
}
