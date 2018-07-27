import React from "react";
import styles from "./styles";
import { cx } from "emotion";
import logo from "resources/havven-logo.svg";

export default class TopNavBar extends React.Component {
  state = {
    isOpen: false
  };

  render() {
    const { isOpen } = this.state;
    return (
      <nav
        className={cx("navbar", styles.navBar)}
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a className="navbar-item" href="https://bulma.io">
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
