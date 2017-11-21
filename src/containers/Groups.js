import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

  render() {
    const { groups } = this.props;
    const { filterWeak } = this.state;
    const reforceCards = this.props.reforceCards.filter((card) => {
      const timeLimitIncrease = 3600 * (6 + 3) * 1000;
      const dateDiff = Math.floor((new Date() - timeLimitIncrease - Date.parse(card.lastView)) / (1000 * 3600 * 24));

      return card.difficulty > 0 && dateDiff >= 1 && (dateDiff % 2 === 0 || card.difficulty >= 0.75);
    });

    return (
      <article className="groups-container">
        {reforceCards.length > 0 &&
          <div
            className="group reforce-cards"
            onClick={() => this.startReforceCardsRevision(reforceCards)}
            style={{ order: -1000000 }}
          >
            <p><span>Reforce Cards</span></p>
            <div className="group-domain error" />
          </div>
        }

        {filterWeak ?
          groups.map((group, i) => {
            const groupDomain = srsAlgo.calcGroupDomain(group.lastview, parseInt(group.repetitions, 10));
            return (groupDomain >= 1 || groupDomain === 'new') ? <Group key={i} data={group} domain={groupDomain} /> : null;
          })
          :
          groups.map((group, i) => {
            const groupDomain = srsAlgo.calcGroupDomain(group.lastview, parseInt(group.repetitions, 10));
            return <Group key={i} data={group} domain={groupDomain} />;
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
