import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'components/Button';
import * as sectionsActions from 'actions/sectionsActions';
import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';

class DeleteSectionDialog extends React.Component {
  componentWillMount() {
    this.props.hideOthersModals();
  }

  confirmDeleteSection() {
    this.props.confirmDeleteSection(this.props.activeSection.id);
    this.props.close();
  }

  render() {
    const { activeSection, close } = this.props;

    return (
      <div className="modal-box">
        <p>Delete section <b>{activeSection.name}</b>?</p>

        <div className="bottom-buttons">
          <Button
            label="DELETE"
            type="flat"
            textColor="#f44"
            alignRight
            onClick={() => this.confirmDeleteSection()}
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

DeleteSectionDialog.propTypes = {
  activeSection: PropTypes.any,
  confirmDeleteSection: PropTypes.any,
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
};

const mapStateToProps = state => ({
  activeSection: state.sections.active === 'ALL' ? { name: 'All Sections' } : state.sections.items.find(section => section.id === state.sections.active),
});

const mapDispatchToProps = dispatch => ({
  confirmDeleteSection: id => dispatch(sectionsActions.deleteSection(id)),
  close: () => dispatch(setModalVisibility('DeleteSectionDialog', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['DeleteSectionDialog'])),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteSectionDialog);
