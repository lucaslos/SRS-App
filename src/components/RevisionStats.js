import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

  componentWillReceiveProps(nextProps) {
    const difference = new Date().getTime() - this.startTime;
    this.remaing = Math.floor(difference / nextProps.position * (nextProps.cardsLength + 1 - nextProps.position));
  }

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
      remaingTime: this.toHHMMSS(this.remaing / 1000),
    });

    this.remaing = this.remaing <= 0
    ? Math.floor((new Date().getTime() - this.startTime) / this.props.position * (this.props.cardsLength + 1 - this.props.position))
    : this.remaing - 1000;
  }

  render() {
    const { activeGroup, cardsLength, position } = this.props;
    return (
      <div className="revision-stats">
        <div className="progress-bar-full" />
        <div className="progress-bar" style={{ width: `${((position + 1) / cardsLength) * 100}%` }} />
        <span className="remaing-time">RT: {this.state.remaingTime}</span>
        <span className="group-name">{activeGroup.name}</span>
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
  activeGroup: state.groups.active === 'REFORCE'
    ? { id: 'REFORCE', name: 'Reforce Cards' }
    : state.groups.items.find(group => group.id === state.groups.active),
  cardsLength: state.cards.items.length,
  position: state.revision.position,
});

export default connect(mapStateToProps)(RevisionStats);
