import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as sectionsActions from 'actions/sectionsActions';
import { setModalVisibility } from 'actions/modalsActions';
import TextField from 'components/TextField';
import Button from 'components/Button';

class EditSectionModal extends React.Component {
  constructor() {
    super();

    this.state = {
      name: {
        value: '',
        isValid: false,
      },
    };
  }

  componentWillMount() {
    // this.props.hideMenu();
  }

  editSection() {
    if (this.state.name.isValid) {
      this.props.editSection(this.props.activeSection.id, this.state.name.value);
      this.props.close();
    }
  }

  handleChange = (name, value, isValid) => {
    this.setState({
      [name]: {
        value,
        isValid,
      },
    });
  }

  render() {
    const { activeSection, close, deleteSectionDialog } = this.props;

    const fieldRegExp = [
      {
        regExp: new RegExp(`${activeSection.name}$`),
        errorMsg: 'The new name must be different from the current.',
        showErrorIfMatch: true,
      },
    ];

    return (
      <div className="modal-box small">
        <h1>Edit section {activeSection.name}</h1>
        <TextField
          label="Section Name"
          name="name"
          value={activeSection.name}
          regExp={fieldRegExp}
          max="100"
          handleChange={this.handleChange}
          required
        />
        <div className="bottom-buttons">
          <Button
            label="DELETE"
            type="flat"
            alignLeft
            textColor="#888"
            onClick={deleteSectionDialog}
          />

          <Button
            label="SAVE"
            type="flat"
            alignRight
            onClick={() => this.editSection()}
            disabled={!this.state.name.isValid}
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

EditSectionModal.propTypes = {
  editSection: PropTypes.func.isRequired,
  activeSection: PropTypes.any,
  deleteSectionDialog: PropTypes.any,
  close: PropTypes.any,
};

const mapStateToProps = state => ({
  activeSection: state.sections.active === 'ALL' ? { name: 'All Sections' } : state.sections.items.find(section => section.id === state.sections.active),
});

const mapDispatchToProps = dispatch => ({
  editSection: (id, newName) => dispatch(sectionsActions.editSection(id, newName)),
  deleteSectionDialog: () => dispatch(setModalVisibility('DeleteSectionDialog', true)),
  close: () => dispatch(setModalVisibility('EditSectionModal', false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSectionModal);
