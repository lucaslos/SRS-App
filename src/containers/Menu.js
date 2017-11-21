import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import * as sectionsActions from 'actions/sectionsActions';
import * as modalsActions from 'actions/modalsActions';
import Button from 'components/Button';

class Menu extends React.Component {
  componentDidUpdate() {
    if (this.props.isActive) {
      window.addEventListener('mousedown', this.handleWindowClick);
    } else {
      window.removeEventListener('mousedown', this.handleWindowClick);
    }
  }

  handleWindowClick = (e) => {
    if (this.container && !this.container.contains(e.target)) {
      this.props.close();
    }
  }

  render() {
    const { sections, setActiveSection, close, showAddSection, isActive, activeSection } = this.props;

    return (
      <nav ref={(i) => { this.container = i; }} className={`left-nav ${isActive ? 'active' : ''}`}>
        <div className="hamburger-button" onClick={() => close()}>
          <div className="hamburger-icon" />
        </div>
        <h2>SECTIONS</h2>
        <Button label="ADD SECTION" onClick={showAddSection} rounded />
        <ul>
          <li>
            <NavLink
              to={'/'}
              exact
              className={activeSection === 'ALL' ? 'active' : ''}
              onClick={() => setActiveSection('ALL')}
            >All Sections</NavLink>
          </li>
          {sections.map(section => (
            <li key={_.uniqueId('section-')}>
              <NavLink
                to={`/section/${section.id}`}
                className={activeSection === section.id ? 'active' : ''}
                onClick={() => setActiveSection(section.id)}
              >{section.name}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

Menu.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.object,
  ])).isRequired,
  setActiveSection: PropTypes.any,
  isActive: PropTypes.any,
  close: PropTypes.any,
  showAddSection: PropTypes.any,
};

const mapStateToProps = state => ({
  sections: state.sections.items,
  activeSection: state.sections.active,
});

const mapDispatchToProps = dispatch => ({
  setActiveSection: projectId => dispatch(sectionsActions.setActiveSection(projectId)),
  close: () => dispatch(modalsActions.setModalVisibility('Menu', false)),
  showAddSection: () => dispatch(modalsActions.setModalVisibility('AddSectionModal', true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
