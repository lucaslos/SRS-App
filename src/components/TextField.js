import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

class TextField extends React.Component {
  componentWillMount() {
    const id = _.uniqueId('input-');

    this.setState({
      isValid: true,
      value: this.props.value,
      id,

    }, () => {
      // pass valid state to parent if a value is defined
      if (this.props.value !== '') {
        this.props.handleChange(this.props.name, this.props.value, this.validField(false));
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isValid !== prevState.isValid) {
      this.handleChange();
    }
  }

  setValue = (newValue) => {
    this.setState({
      value: newValue,
    }, this.validField);

    this.props.handleChange(this.props.name, newValue, this.state.isValid);
  }

  validField = (updateState = true) => {
    const value = this.input.value;

    const inputLenght = value.trim().length;
    let isValid = true;
    let errorMsg = '';

    if (this.props.required && inputLenght === 0) {
      isValid = false;
      errorMsg = "Error: This field can't be blank";
    } else if (this.props.regExp) {
      errorMsg = this.props.regExp
      .filter((item) => {
        const matched = item.regExp.test(value);

        return item.showErrorIfMatch ? matched : !matched;
      })
      .map(item => `Error: ${item.errorMsg}`)
      .join('<br>');

      isValid = !(errorMsg);
    }

    if (updateState) {
      this.setState({
        isValid,
        displayError: errorMsg,
      });
    }

    return isValid;
  }

  handleChange(e) {
    const value = e ? e.target.value : this.state.value;

    if (e) {
      this.setState({
        value: e.target.value,
      });
    }

    this.props.handleChange(this.props.name, value, this.state.isValid);
  }

  autoExpand(e) {
    this.handleChange(e);

    this.input.style.height = '';

    const maxHeight = 120;
    const minHeight = 54;
    let textHeight = this.input.scrollHeight;

    if (textHeight < minHeight) {
      textHeight = minHeight;
    } else if (textHeight > maxHeight) {
      textHeight = maxHeight;
    }

    this.input.style.height = `${textHeight}px`;
  }

  render() {
    const { multiLine, maxlength, type, placeholder, max, min, step } = this.props;
    const { isValid, id, value } = this.state;
    let textField = null;

    if (!multiLine) {
      textField = (
        <input
          id={id}
          value={value}
          ref={(i) => { this.input = i; }}
          className={`text-field ${!isValid ? 'invalid' : ''}`}
          type={type}
          onBlur={this.validField}
          onChange={e => this.handleChange(e)}
          maxLength={maxlength}
          max={max}
          min={min}
          step={step}
          required
        />
      );
    } else {
      textField = (
        <textarea
          id={id}
          value={value}
          ref={(i) => { this.input = i; }}
          className={`multiline-field ${!isValid ? 'invalid' : ''}`}
          onBlur={this.validField}
          onChange={e => this.autoExpand(e)}
          maxLength={maxlength}
          required
        />
      );
    }

    return (
      <div className="field-container" style={{ width: this.props.width }}>
        <div className={`input-wrapper ${multiLine ? 'multiline' : ''}`}>
          { textField }
          <div className="focus-bar" />
          <label htmlFor={id} className={`floating-label ${!placeholder ? 'disable-placeholder' : ''}`}>{ this.props.label }</label>
        </div>
        {!isValid &&
          <div className="validation-error">{ this.state.displayError }</div>
        }
      </div>
    );
  }
}

TextField.propTypes = {
  regExp: PropTypes.arrayOf(
    PropTypes.object,
  ),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  width: PropTypes.string,
  multiLine: PropTypes.bool,
  required: PropTypes.bool,
  maxlength: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  max: PropTypes.string,
  min: PropTypes.string,
};

TextField.defaultProps = {
  width: '100%',
  maxlength: '100',
  type: 'text',
  value: '',
  placeholder: true,
};

export default TextField;
