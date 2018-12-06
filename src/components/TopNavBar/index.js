import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';

export default class TopNavBar extends React.Component {
  static propTypes = {
    selectedSection: PropTypes.string,
  };

  state = {
    isOpen: false,
    section: 'stats',
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
              <img
                src={'/images/synthetix-logo.png'}
                alt="Havven"
                width="250"
              />
            </a>

            <a
              role="button"
              className={cx('navbar-burger', { 'is-active': isOpen })}
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
                <NavLink href="javascript:void(0)" to="/buy-snx">
                  SNX
                </NavLink>
              </div>
              <div className="level-left">
                <NavLink href="javascript:void(0)" to="/buy-susd">
                  sUSD
                </NavLink>
              </div>
            </div>
          </div>
          <div
            className={cx('navbar-menu', {
              'is-active': isOpen,
            })}
          >
            <div className="navbar-end">
              <NavLink exact to="/" className="navbar-item">
                Dashboard
              </NavLink>
              <NavLink to="/buy-snx" className="navbar-item">
                Buy SNX
              </NavLink>
              <NavLink to="/buy-susd" className="navbar-item">
                Buy sUSD
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
