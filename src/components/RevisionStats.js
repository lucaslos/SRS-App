import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as revisionActions from 'actions/revisionActions';

class RevisionStats extends React.Component {
  componentWillMount() {
    this.startTime = new Date().getTime();

    this.tick();
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  // componentWillReceiveProps(nextProps) {
  //   const difference = new Date().getTime() - this.startTime;
  //   this.elapsed = Math.floor(difference / nextProps.position * (nextProps.cardsLength + 1 - nextProps.position));
  // }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  toHHMMSS = (secs) => {
    const secNum = parseInt(secs, 10);
    const hours = Math.floor(secNum / 3600) % 24;
    const minutes = Math.floor(secNum / 60) % 60;
    const seconds = secNum % 60;

    return isNaN(seconds)
      ? '--:--'
      : [hours, minutes, seconds]
        .map(v => (v < 10 ? `0${v}` : v))
        .filter((v, i) => v !== '00' || i > 0)
        .join(':');
  }

  tick = () => {
    this.setState({
      elapsedTime: this.toHHMMSS(this.elapsed / 1000),
    });

    this.props.setRevisionDuration(this.elapsed);

    this.elapsed = new Date().getTime() - this.startTime;
  }

  render() {
    const { activeGroup, cardsLength, position } = this.props;
    return (
      <div className="revision-stats">
        <div className="progress-bar-full" />
        <div className="progress-bar" style={{ width: `${((position + 1) / cardsLength) * 100}%` }} />
        <span className="remaing-time">ET: {this.state.elapsedTime}</span>
        <span className="group-name">{activeGroup ? activeGroup.name : ''}</span>
        <span className="progress">{position + 1} / {cardsLength}</span>
      </div>
    );
  }
}

RevisionStats.propTypes = {
  hideOthersModals: PropTypes.any,
  activeGroup: PropTypes.any,
  close: PropTypes.any,
  position: PropTypes.any,
  cardsIsFetching: PropTypes.any,
  fetchCards: PropTypes.any,
  showEditGroup: PropTypes.any,
  startRevision: PropTypes.any,
};

const mapStateToProps = state => ({
  activeGroup: state.groups.active === 'REFORCE' && state.cards.items[state.revision.position]
    ? { id: 'REFORCE', name: `Ref. Cards - ${state.groups.items.find(group => group.id === state.cards.items[state.revision.position].group_id).name}` }
    : state.groups.items.find(group => group.id === state.groups.active),
  cardsLength: state.cards.items.length,
  position: state.revision.position,
});

const mapDispatchToProps = dispatch => ({
  setRevisionDuration: time => dispatch(revisionActions.setRevisionDuration(time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RevisionStats);
