import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import * as _Actions from 'actions/_Actions';
// import Group from 'component/Group';

const roundPercentage = num => Math.round(num * 1000) / 10;

const GeneralStats = ({ logs, activeSection }) => {
  const logsFiltered = logs.filter(log => (
    parseInt(log.repetitionsBeforeReview, 10) !== 0)
    && log.group.section_id === activeSection
  );

  const failureRate = logsFiltered.map(log => log.failureRate);

  const averageFailureRate = roundPercentage(failureRate.reduce((a, b) => a + b) / failureRate.length);

  return (
    <div>
      <ul>
        <li>Average wrong rate: {averageFailureRate}%</li>
        <li>Good reviews: {roundPercentage(failureRate.filter(log => log <= 0.23).length / failureRate.length)}%</li>
      </ul>
    </div>
  );
};

const mapStateToProps = state => ({
  cards: state.reforceCards.items,
  activeSection: state.sections.active,
});

export default connect(mapStateToProps)(GeneralStats);
