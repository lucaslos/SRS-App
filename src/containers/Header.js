import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from 'components/Icon';
import * as modalsActions from 'actions/modalsActions';

class Header extends React.Component {
  constructor() {
    super();

    this.state = {
      dropDownIsActive: false,
    };
  }

  toggleMoreOptions = () => {
    this.setState({
      dropDownIsActive: !this.state.dropDownIsActive,
    });
  }

  render() {
    const { toggleMenu, showSearch } = this.props;
    const { dropDownIsActive } = this.state;
    const userImg = window.userImg;
    const userName = window.userName;

    return (
      <header className="header-container">
        <div className="hamburger-button" onClick={() => toggleMenu()}>
          <div className="hamburger-icon" />
        </div>
        <div className="logo">SRS</div>
        <div className="search-button" onClick={() => showSearch()}><Icon name="search" /></div>
        {/* <div
          className="user-profile"
          style={{
            background: `url(${userImg})`,
            backgroundSize: 'cover',
          }}
          onClick={this.toggleMoreOptions}
        />
        <div
          ref={(i) => { this.container = i; }}
          className={`drop-down ${dropDownIsActive ? 'active' : ''}`}
        >
          <ul>
            <li><h1>{userName}</h1></li>
            <li><a href="http://localhost:4000/auth/logout" className="item">Logout</a></li>
          </ul>
        </div> */}
      </header>
    )
  }
};

Header.propTypes = {
  toggleMenu : PropTypes.any,
  // dispatch : PropTypes.any,
  // match : PropTypes.any,
  // showAllSections : PropTypes.any,
  // modals : PropTypes.any,
};

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(modalsActions.setModalVisibility('Menu', true)),
  showSearch: () => dispatch(modalsActions.setModalVisibility('SearchModal', true)),
});

export default connect(null, mapDispatchToProps)(Header);
