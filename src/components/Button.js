import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Button extends React.Component {
  componentWillMount() {
    this.setState({
      disabled: this.props.disabled,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.disabled !== nextProps.disabled) {
      this.setState({
        disabled: nextProps.disabled,
      });
    }
  }

  render() {
    const { label, type, size, textColor, alignRight, alignLeft, rounded, onClick } = this.props;
    const { disabled } = this.state;

    const buttonClass = classNames(
      'button',
      [type],
      [size],
      { disabled },
      { rounded },
      { 'align-right': alignRight },
      { 'align-left': alignLeft },
    );

    return (
      <button
        className={buttonClass}
        style={{ color: textColor }}
        onClick={disabled ? null : onClick}
      >{label}</button>
    );
  }
}

Button.propTypes = {
  label: PropTypes.any,
  onClick: PropTypes.any,
  type: PropTypes.any,
  disabled: PropTypes.any,
  size: PropTypes.any,
  textColor: PropTypes.any,
  rounded: PropTypes.any,
  alignRight: PropTypes.any,
  alignLeft: PropTypes.any,
};

Button.defaultProps = {
  type: 'raised',
  disabled: false,
  size: 'medium',
  onClick: () => false,
  rounded: false,
};

export default Button;
