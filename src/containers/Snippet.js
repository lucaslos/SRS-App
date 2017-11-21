import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import * as _Actions from 'actions/_Actions';
// import Group from 'component/Group';

class CompName extends React.Component {
  render() {
    // const { property } = this.props;

    return (
      null
    );
  }
}

// CompName.propTypes = {
//   property : PropTypes.
// };

const mapStateToProps = state => ({
  // change: state.change,
});

const mapDispatchToProps = dispatch => ({
  // set: arg => dispatch(_Actions.set(arg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompName);
