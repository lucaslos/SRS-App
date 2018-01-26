import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import * as _Actions from 'actions/_Actions';
// import Group from 'component/Group';

const trimMean = (array, percentage) => {
  array.sort((a, b) => a - b);
  const l = array.length;
  const low = Math.round(l * (percentage / 100));
  const high = l - low;
  return array.slice(low, high);
};

const roundPercentage = num => Math.round(num * 1000) / 10;

const GeneralStats = ({ logs, activeSection, cards }) => {
  const logsFiltered = logs.filter(log => (
    parseInt(log.repetitionsBeforeReview, 10) !== 0)
    && log.group.section_id === activeSection
  );

  const failureRate = logsFiltered.map(log => log.failureRate);

  const averageFailureRate = roundPercentage(failureRate.reduce((a, b) => a + b) / failureRate.length);

  const date = new Date(), y = date.getFullYear(), m = date.getMonth(); // eslint-disable-line
  const firstDay = new Date(y, m, 1);

  const cardsAddLastMonth = cards.filter(card => card.createdAt > firstDay).length;

  const newGroupsLogsTime = trimMean(logs.filter(log => (
    log.group.id !== 'REFORCE'
    && parseInt(log.repetitionsBeforeReview, 10) === 0
    && log.revisionDuration
    && log.group.section_id === activeSection
  )).map(log => log.revisionDuration / log.cardsLength), 20);

  const reforceCardsLogsTime = trimMean(logs.filter(log => (
    log.group.id === 'REFORCE'
    && log.revisionDuration
  )).map(log => log.revisionDuration / log.cardsLength), 20);

  const oneReviewGroupsLogsTime = trimMean(logs.filter(log => (
    parseInt(log.repetitionsBeforeReview, 10) === 1
    && log.revisionDuration
    && log.group.section_id === activeSection
  )).map(log => log.revisionDuration / log.cardsLength), 20);

  const othersGroupsLogsTime = trimMean(logs.filter(log => (
    parseInt(log.repetitionsBeforeReview, 10) !== 0
    && parseInt(log.repetitionsBeforeReview, 10) !== 1
    && log.revisionDuration
    && log.group.section_id === activeSection
  )).map(log => log.revisionDuration / log.cardsLength), 20);

  const stats = [
    {
      name: 'Average wrong rate',
      text: averageFailureRate,
    },
    {
      name: 'Good reviews',
      text: `${roundPercentage(failureRate.filter(log => log <= 0.23).length / failureRate.length)}%`,
    },
    {
      name: 'Cards Add Last Month',
      text: cardsAddLastMonth,
    },
    {
      name: 'Reforce Cards Average Review Time Per Card',
      text: reforceCardsLogsTime.length !== 0 ? `${Math.round(reforceCardsLogsTime.reduce((a, b) => a + b) / reforceCardsLogsTime.length / 1000)} s` : 'Null',
    },
    {
      name: 'New Group Average Review Time Per Card',
      text: newGroupsLogsTime.length !== 0 ? `${Math.round(newGroupsLogsTime.reduce((a, b) => a + b) / newGroupsLogsTime.length / 1000)} s` : 'Null',
    },
    {
      name: '1 Review Groups Average Review Time Per Card',
      text: oneReviewGroupsLogsTime.length !== 0 ? `${Math.round(oneReviewGroupsLogsTime.reduce((a, b) => a + b) / oneReviewGroupsLogsTime.length / 1000)} s` : 'Null',
    },
    {
      name: 'Others Groups Average Review Time Per Card',
      text: othersGroupsLogsTime.length !== 0 ? `${Math.round(othersGroupsLogsTime.reduce((a, b) => a + b) / othersGroupsLogsTime.length / 1000)} s` : 'Null',
    },
  ];

  return (
    <div>
      <ul>
        {stats.map(stat => <li>{stat.name}: {stat.text}</li>)}
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  cards: state.reforceCards.items,
  activeSection: state.sections.active,
});

export default connect(mapStateToProps)(GeneralStats);
