import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { srsAlgo } from 'utils';

import Group from 'components/Group';
import * as cardsActions from 'actions/cardsActions';
import { setModalVisibility } from 'actions/modalsActions';
import { setActiveGroup } from 'actions/groupsActions';

class Groups extends React.Component {
  componentWillMount() {
    this.setState({
      filterWeak: this.props.filterWeak,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ filterWeak: nextProps.filterWeak });
  }

  startReforceCardsRevision = (reforceCards) => {
    // pass cards to cache
    this.props.setCards(reforceCards);
    // set active group
    this.props.setActiveGroupId('REFORCE');
    this.props.showRevisionModal();
  }

  getNumOfCards = groupId => this.props.reforceCards.filter(card => card.group_id === groupId).length;

  render() {
    const { groups } = this.props;
    const { filterWeak } = this.state;
    const reforceCards = this.props.reforceCards.filter((card) => {
      const timeLimitIncrease = 3600 * (6 + 3) * 1000; // time to normalize srs calculation (shift day end)
      const diff = parseFloat(card.difficulty); // parse float

      // calc the diff between last review and now of card
      const dateDiff = Math.floor((new Date() - timeLimitIncrease - Date.parse(card.lastView)) / (1000 * 3600 * 24));

      return (
        (diff === 0.25 && dateDiff >= 3) // 0.25 = 3 days interval
        || (diff === 0.5 && dateDiff >= 2) // 0.5 = 2 days interval
        || (diff >= 0.75 && dateDiff > 0) // 0.75 or higher = 1 day interval
      );
    });

    return (
      <article className="groups-container">
        {reforceCards.length > 0 &&
          <div
            className="group reforce-cards"
            onClick={() => this.startReforceCardsRevision(reforceCards)}
            style={{ order: -1000000 }}
            title={`Cards: ${reforceCards.length} ETR: ${new Date(localStorage.getItem('averageCardReviewTimeCR') * reforceCards.length * 1000).toISOString().substr(14, 5)}`}
          >
            <p><span>Reforce Cards</span></p>
            <div className="group-domain error" />
          </div>
        }

        {filterWeak ?
          groups.map((group, i) => {
            const groupDomain = srsAlgo.calcGroupDomain(group.lastview, parseInt(group.repetitions, 10));
            const numOfCards = this.getNumOfCards(group.id);
            return (groupDomain >= 1 || groupDomain === 'new') ? <Group key={i} data={group} domain={groupDomain} numOfCards={numOfCards} /> : null;
          })
          :
          groups.map((group, i) => {
            const groupDomain = srsAlgo.calcGroupDomain(group.lastview, parseInt(group.repetitions, 10));
            const numOfCards = this.getNumOfCards(group.id);
            return <Group key={i} data={group} domain={groupDomain} numOfCards={numOfCards} />;
          })}
      </article>
    );
  }
}

Groups.propTypes = {
  groups : PropTypes.any,
  filterWeak : PropTypes.any,
};

const mapStateToProps = state => ({
  groups: state.groups.items,
  filterWeak: state.groups.filterWeakGroups,
  reforceCards: state.reforceCards.items,
});

const mapDispatchToProps = dispatch => ({
  setCards: cards => dispatch(cardsActions.setCards(cards)),
  setActiveGroupId: groupId => dispatch(setActiveGroup(groupId)),
  showRevisionModal: () => dispatch(setModalVisibility('RevisionDialog', true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
