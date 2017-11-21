import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';
import * as groupsActions from 'actions/groupsActions';
import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';

class DeleteGroupDialog extends React.Component {
  componentWillMount() {
    this.props.hideOthersModals();
    this.setState({ name: this.props.activeGroup.name })
  }

  confirmDeleteGroup() {
    this.props.close();
    this.props.confirmDeleteGroup(this.props.activeGroup.id, this.props.deleteCards);
  }

  render() {
    const { activeGroup, close } = this.props;

    return (
      <div className="modal-box">
        <p>Delete group <b>{this.state.name}</b>?</p>

        <div className="bottom-buttons">
          <Button
            label="DELETE"
            type="flat"
            textColor="#f44"
            alignRight
            onClick={() => this.confirmDeleteGroup()}
          />
          <Button
            label="CANCEL"
            type="flat"
            alignRight
            onClick={close}
          />
        </div>
      </div>
    );
  }
}

DeleteGroupDialog.propTypes = {
  activeGroup: PropTypes.any,
  confirmDeleteGroup: PropTypes.any,
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
};

const mapStateToProps = state => ({
  activeGroup: state.groups.items.find(group => group.id === state.groups.active),
  deleteCards: state.cards.items.map(card => card.id),
});

const mapDispatchToProps = dispatch => ({
  confirmDeleteGroup: (id, deleteCards) => dispatch(groupsActions.deleteGroup(id, deleteCards)),
  close: () => dispatch(setModalVisibility('DeleteGroupDialog', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['DeleteGroupDialog'])),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteGroupDialog);
