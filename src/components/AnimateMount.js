import React from 'react';
import PropTypes from 'prop-types';

class AnimateMount extends React.Component {
  componentWillMount() {
    this.setState({
      show: this.props.mounted,
      useClass: this.props.from,
      style: this.props.styles.from,
      // invert: this.props.invert,
    });
  }

  componentDidMount() {
    // call the into animiation
    setTimeout(this.mountStyle, 10);
  }

  componentWillReceiveProps(newProps) { // check for the mounted props
    if (newProps.mounted) {
      // remount the node when the mounted prop is true
      this.setState({
        useClass: newProps.from,
        show: true,
        // invert: this.props.invert,
      });

      // call the into animiation
      setTimeout(this.mountStyle, 10);

    // call out animation when mounted prop is false
    } else {
      this.unMountStyle(newProps);
    }
  }

  unMountStyle = (newProps) => {
    if (this.container) this.setState({
      style: newProps.styles.to,
      useClass: newProps.to,
    });
  }

  mountStyle = () => {
    this.setState({
      style: this.props.styles.normal,
      useClass: this.props.normal,
    });
  }

  transitionEnd = () => {
    // remove the node on transition end when the mounted prop is false
    if (!this.props.mounted) {
      if (this.container) this.setState({
        show: false,
      });
    }
  }

  render() {
    const { containerClass, useClass, children } = this.props;

    return (
      this.state.show &&
        <div
          ref={(c) => { this.container = c; }}
          className={`${containerClass} ${useClass ? this.state.useClass : ''}`}
          style={!useClass ? this.state.style : null}
          onTransitionEnd={this.transitionEnd}
        >
          {children}
        </div>
    );
  }
}

AnimateMount.propTypes = {
  mounted: PropTypes.any,
  children: PropTypes.any,
  styles: PropTypes.any,
  containerClass: PropTypes.any,
  useClass: PropTypes.any,
  classes: PropTypes.any,
  from: PropTypes.any,
  to: PropTypes.any,
  normal: PropTypes.any,
  // invert: PropTypes.any,
};

AnimateMount.defaultProps = {
  styles: {
    from: {},
    normal: {},
    to: {},
  },
  from: 'anim-from',
  normal: 'anim-to',
  to: 'anim-from',
  // invert: false,
};

export default AnimateMount;
