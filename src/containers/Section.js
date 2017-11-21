import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Groups from 'containers/Groups';
import GroupStats from 'components/GroupStats';
import Icon from 'components/Icon';
import Switcher from 'components/Switcher';

import * as groupsActions from 'actions/groupsActions';
import * as cardsActions from 'actions/cardsActions';
import { setModalVisibility } from 'actions/modalsActions';

const Section = ({ groups, section, showEditSection, showAddGroup, resetCards }) => (
  <section className="section-container">
    <header>
      <h1>{section.name || 'All Sections'}</h1>
      {section.name &&
        <div className="edit-button" onClick={showEditSection}>
          <Icon name="edit" />
        </div>
      }
      <Switcher />
    </header>

    <Groups />

    {section.name &&
      <div
        className="floating-action-btn"
        onClick={() => {
          resetCards();
          showAddGroup();
        }}
      >
        <Icon name="add" color="#fff" />
      </div>
    }
    {section.name && <GroupStats />}
  </section>
);

Section.propTypes = {
  activeSection : PropTypes.any,
  fetchGroups : PropTypes.any,
  groups : PropTypes.any,
  section : PropTypes.any,
  showEditSection : PropTypes.any,
  showAddGroup : PropTypes.any,
};

const mapStateToProps = state => ({
  groups: state.groups.items,
  section: state.sections.active === 'ALL' ? { name: false } : state.sections.items.find(section => section.id === state.sections.active),
});

const mapDispatchToProps = dispatch => ({
  fetchGroups: sectionId => dispatch(groupsActions.fetchGroups(sectionId)),
  resetCards: () => dispatch(cardsActions.reset()),
  showEditSection: () => dispatch(setModalVisibility('EditSectionModal', true)),
  showAddGroup: () => dispatch(setModalVisibility('AddGroupModal', true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Section);
