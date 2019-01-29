import React from 'react';
import PropTypes from 'prop-types';

/*
Handle change function
  (value, isValid) => {
  // change value...
},
*/

class TextField extends React.PureComponent {
  state = {
    isValid: true,
    value: this.props.value,
    id: Date.now() + Math.random(),
  };

  /* implements timeout for avoid too much calls to handle change */
  componentDidUpdate(prevProps, prevState) {
    if (
      (this.state.isValid !== prevState.isValid)
      || (this.state.value !== prevState.value)
    ) {
      if (this.props.timeout > 0) {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          this.props.handleChange(this.state.value, this.state.isValid);
        }, this.props.timeout);
      } else {
        this.props.handleChange(this.state.value, this.state.isValid);
      }
    }
  }

  // update the value when the prop value change TODO: improve
  // static getDerivativeStateFromProps(nextProps) {
  //   if (nextProps.value !== this.state.value) {
  //     this.setValue(null, nextProps.value);
  //   }

  //   return null;
  // }

  // set value and validates the field
  setValue = (e, forceValue = false) => {
    const input = forceValue || this.input.value;
    const value = (typeof input === 'number') ? input.toString() : input;

    const inputLenght = value.trim().length;
    let isValid = true;
    let errorMsg = '';

    if (this.props.required && inputLenght === 0) {
      isValid = false;
      errorMsg = [this.props.requiredErrorMsg];
    } else if (this.props.max && input > this.props.max) {
      isValid = false;
      errorMsg = [this.props.maxErrorMsg];
    } else if (this.props.min && input < this.props.min) {
      isValid = false;
      errorMsg = [this.props.minErrorMsg];
    } else if (this.props.validations) {
      errorMsg = this.props.validations
        .filter((item) => {
          const matched = item.regex ? item.regex.test(value) : item.validator(value);

          return item.showErrorIfMatch ? matched : !matched;
        })
        .map(item => item.errorMsg);

      isValid = errorMsg.length === 0;
    }

    this.setState({
      value,
      isValid,
      displayError: errorMsg,
    });

    return isValid;
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
    const {
      props: {
        width,
        multiLine,
        maxlength,
        type,
        placeholder,
        max,
        min,
        step,
        className,
        label,
      },
      state: {
        displayError,
        isValid,
        id,
        value,
      },
    } = this;

    const textField = (!multiLine)
      ? (
        <input
          id={id}
          value={value}
          ref={(i) => { this.input = i; }}
          className={`text-field ${!isValid ? 'invalid' : ''}`}
          type={type}
          onBlur={this.setValue}
          onChange={this.setValue}
          maxLength={maxlength}
          max={max}
          min={min}
          step={step}
        />
      ) : (
        <textarea
          id={id}
          value={value}
          ref={(i) => { this.input = i; }}
          className={`text-field multiline ${!isValid ? 'invalid' : ''}`}
          onBlur={this.setValue}
          onChange={this.setValue}
          maxLength={maxlength}
        />
      );

    const notEmpty = `${value}`.trim().length > 0;

    return (
      <div
        className={`field-container ${className} ${!isValid ? 'invalid' : ''} ${notEmpty ? 'not-empty' : ''}`}
        style={{ width }}
      >
        <div
          className={`input-wrapper ${multiLine ? 'multiline' : ''}`}
        >
          { textField }
          <label
            htmlFor={id}
            className={`floating-label ${!placeholder ? 'disable-placeholder' : ''}`}
          >
            { label }
          </label>
        </div>
        {!isValid &&
          <div className="validation-error">
            {displayError ? displayError.map((error, i) => [
              <span key={i}>{error}</span>,
              i < displayError.length ? <br key={`${i}-br`} /> : null,
            ]) : null}
          </div>
        }
      </div>
    );
  }
}

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  validations: PropTypes.arrayOf(PropTypes.shape({
    regex: PropTypes.any,
    showErrorIfMatch: PropTypes.bool,
    validator: PropTypes.func,
  })),
  width: PropTypes.string,
  multiLine: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.bool,
  maxlength: PropTypes.number,
  className: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  type: PropTypes.string,
  timeout: PropTypes.number,
  requiredErrorMsg: PropTypes.string,
  minErrorMsg: PropTypes.string,
  maxErrorMsg: PropTypes.string,
};

TextField.defaultProps = {
  className: '',
  width: '100%',
  maxlength: 300,
  type: 'text',
  value: '',
  timeout: 50,
  placeholder: true,
  requiredErrorMsg: 'This field can\'t be blank',
  minErrorMsg: 'The value must be higher than',
  maxErrorMsg: 'The value must be less than',
};

export default TextField;
