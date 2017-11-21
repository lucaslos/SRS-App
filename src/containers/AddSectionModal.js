import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as sectionsActions from 'actions/sectionsActions';
import * as modalsActions from 'actions/modalsActions';
import TextField from 'components/TextField';
import Button from 'components/Button';

class AddSectionModal extends React.Component {
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
    this.props.hideMenu();
  }

  addSection() {
    if (this.state.name.isValid) {
      this.props.addSection(this.state.name.value);
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
    return (
      <div className="modal-box small">
        <h1>Add section</h1>
        <TextField
          label="Section Name"
          name="name"
          errorMsg="validationError"
          max="100"
          handleChange={this.handleChange}
          required
        />
        <div className="bottom-buttons">
          <Button
            label="ADD"
            type="flat"
            alignRight
            onClick={() => this.addSection()}
            disabled={!this.state.name.isValid}
          />
          <Button
            label="CANCEL"
            type="flat"
            alignRight
            onClick={() => this.props.close()}
          />
        </div>
      </div>
    );
  }
}

AddSectionModal.propTypes = {
  addSection: PropTypes.func.isRequired,
  hideMenu: PropTypes.any,
  close: PropTypes.any,
};

const mapDispatchToProps = dispatch => ({
  addSection: name => dispatch(sectionsActions.addSection(name)),
  hideMenu: () => dispatch(modalsActions.setModalVisibility('Menu', false)),
  close: () => dispatch(modalsActions.setModalVisibility('AddSectionModal', false)),
});

export default connect(null, mapDispatchToProps)(AddSectionModal);
