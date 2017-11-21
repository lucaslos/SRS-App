import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleFilterWeakGroups } from 'actions/groupsActions';

class Group extends React.Component {
  componentWillMount() {
    this.setState({ currentFilter: true });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentFilter: nextProps.currentFilter });
  }

  componentDidMount() {
    const falseElemOffset = this.false.getBoundingClientRect().left - this.parent.getBoundingClientRect().left;

    this.selector.style.width = `${this.props.currentFilter ? this.true.offsetWidth : this.false.offsetWidth}px`;
    this.selector.style.left = `${this.props.currentFilter ? 0 : falseElemOffset}px`;
  }

  componentDidUpdate() {
    const falseElemOffset = this.false.getBoundingClientRect().left - this.parent.getBoundingClientRect().left;

    this.selector.style.width = `${this.props.currentFilter ? this.true.offsetWidth : this.false.offsetWidth}px`;
    this.selector.style.left = `${this.props.currentFilter ? 0 : falseElemOffset + 2}px`;
  }

  render() {
    const { toggleFilter } = this.props;
    const { currentFilter } = this.state;

    return (
      <div
        className="switcher"
        onClick={toggleFilter}
        ref={(c) => { this.parent = c; }}
      >
        <div ref={(c) => { this.selector = c; }} className="selector" />
        <div className="options">
          <span ref={(c) => { this.true = c; }} className={`true ${currentFilter ? 'active' : ''}`}>Weak</span>
          <span ref={(c) => { this.false = c; }} className={`false  ${!currentFilter ? 'active' : ''}`}>All</span>
        </div>
      </div>
    );
  }
}

Group.propTypes = {
  currentFilter: PropTypes.any,
  toggleFilter: PropTypes.any,
};

const mapStateToProps = state => ({
  currentFilter: state.groups.filterWeakGroups,
});

const mapDispatchToProps = dispatch => ({
  toggleFilter: () => dispatch(toggleFilterWeakGroups()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);
