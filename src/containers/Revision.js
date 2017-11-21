import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AnimateMount from 'components/AnimateMount';
import Icon from 'components/Icon';
import RevisionStats from 'components/RevisionStats';

import Card from 'containers/Card';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';

class Revision extends React.Component {
  componentWillMount() {
    this.props.hideOthersModals();
    this.setState({ reverse: false });
    window.onbeforeunload = () => ('Are you sure?');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      reverse: nextProps.position < this.props.position,
    });
  }

  showEditGroup = () => {
    this.props.fetchCards(this.props.activeGroup.id);
    this.props.close();
    this.props.showEditGroup();
  }

  componentWillUnmount() {
    window.onbeforeunload = null;
  }

  render() {
    const { cardsIsFetching, close, activeGroup, position, modals } = this.props;
    const { reverse } = this.state;
    const posIsEven = position % 2 === 0;

    return (
      <div className={`revision ${modals.EditCardModal || modals.DeleteCardDialog || modals.DictionaryModal ? 'hide' : ''}`}>
        <div className="close-button" onClick={close}><Icon name="close" /></div>
        {cardsIsFetching &&
          <div className="loading-overlay">
          ...Loading
          </div>
        }
        <AnimateMount
          containerClass="card-anim"
          useClass
          from={!reverse ? 'anim-front' : 'anim-back'}
          normal="normal"
          to={!reverse ? 'anim-back' : 'anim-front'}
          mounted={posIsEven && !cardsIsFetching}
        >
          <Card activeGroup={activeGroup} mounted={posIsEven} />
        </AnimateMount>

        <AnimateMount
          containerClass="card-anim"
          useClass
          from={!reverse ? 'anim-front' : 'anim-back'}
          normal="normal"
          to={!reverse ? 'anim-back' : 'anim-front'}
          mounted={!posIsEven && !cardsIsFetching}
        >
          <Card activeGroup={activeGroup} mounted={!posIsEven} />
        </AnimateMount>
        <RevisionStats />
      </div>
    );
  }
}

Revision.propTypes = {
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
  activeGroup: state.groups.items.find(group => group.id === state.groups.active),
  cardsIsFetching: state.cards.isFetching,
  position: state.revision.position,
  cardsLength: state.cards.length,
  modals: state.modalsVisibility,
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(setModalVisibility('Revision', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['Revision'])),
  showEditGroup: () => dispatch(setModalVisibility('EditGroupModal', true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Revision);
