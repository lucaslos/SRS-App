import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';
import AnimateMount from 'components/AnimateMount';

import Card from 'containers/Card';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';
import { startRevision } from 'actions/revisionActions';
import { fetchCards, reset } from 'actions/cardsActions';

class RevisionDialog extends React.Component {
  componentWillMount() {
    this.props.hideOthersModals();
  }

  showEditGroup = () => {
    this.props.resetCards();
    this.props.fetchCards(this.props.activeGroup.id);
    this.props.close();
    this.props.showEditGroup();
  }

  startRevision = () => {
    this.props.startRevision(this.props.activeGroup.id);
  }

  render() {
    const { close, activeGroup } = this.props;
    // TODO: close button
    return (
      <div className="revision-box">
        <div className="group-name"><h1>{activeGroup.name}</h1></div>
        <div className="bottom-buttons">
          <Button
            label="START REVISION"
            type="flat"
            alignRight
            onClick={this.startRevision}
          />
          <Button
            label="CANCEL"
            type="flat"
            alignRight
            onClick={close}
          />
          {activeGroup.id !== 'REFORCE' &&
            <Button
              label="EDIT GROUP"
              type="flat"
              alignLeft
              textColor="#888"
              onClick={this.showEditGroup}
            />
          }
        </div>
      </div>
    );
  }
}

RevisionDialog.propTypes = {
  hideOthersModals: PropTypes.any,
  activeGroup: PropTypes.any,
  close: PropTypes.any,
  position: PropTypes.any,
  cardsIsFetching: PropTypes.any,
  fetchCards: PropTypes.any,
  showEditGroup: PropTypes.any,
  startRevision: PropTypes.any,
};

const mapStateToProps = state => ({
  activeGroup: state.groups.active === 'REFORCE'
    ? { id: 'REFORCE', name: 'Reforce Cards' }
    : state.groups.items.find(group => group.id === state.groups.active),
  cardsIsFetching: state.cards.isFetching,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(setModalVisibility('RevisionDialog', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['RevisionDialog'])),
  startRevision: groupId => dispatch(startRevision(groupId)),
  fetchCards: groupId => dispatch(fetchCards(groupId)),
  resetCards: () => dispatch(reset()),
  showEditGroup: () => dispatch(setModalVisibility('EditGroupModal', true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RevisionDialog);
