import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { srsAlgo } from 'utils';
import Highcharts from 'highcharts';

class GropStats extends React.Component {
  constructor() {
    super();

    this.state = {
      isExpanded: false,
    };
  }

  toggleExpand = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });

    if (!this.state.isExpanded)
      this.generateChart();
    else
      this.chart.destroy();
  }

  generateChart = () => {
    const data = JSON.parse(localStorage.getItem('log') || '[]')
      .filter(log => log.repetitionsBeforeReview != 0) // eslint-disable-line
      .map(log => [log.repetitionsBeforeReview, log.failureRate]);

    this.chart = Highcharts.chart(this.chartContainer, {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
      },
      title: {
        text: 'WrongRate vs Repetitions',
      },
      xAxis: {
        title: {
          enabled: true,
          text: 'Repetitions',
          allowDecimals: false,
        },
        tickInterval: 1,
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          text: 'WrongRate',
        },
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)',
              },
            },
          },
          states: {
            hover: {
              marker: {
                enabled: false,
              },
            },
          },
          tooltip: {
            pointFormat: '{point.x} Repetitions, {point.y} WrongRate',
          },
        },
      },
      series: [
        {
          name: 'Repetitions/WrongRate',
          color: 'rgba(119, 152, 191, .7)',
          data,
        },
      ],
    });
  }

  render() {
    const { cards, groups } = this.props;
    const { isExpanded } = this.state;
    let cardPrevisionNextDay = 0;
    let cardPrevisionNext2Days = 0;
    groups.forEach((group) => {
      const groupDomain = srsAlgo.calcGroupDomain(group.lastview, parseInt(group.repetitions, 10), 3600 * 24 * 2 * 1000);
      if (groupDomain > 1 && group.repetitions !== 0) {
        cardPrevisionNextDay++;
      } else if (groupDomain === 1 && group.repetitions !== 0) {
        cardPrevisionNext2Days++;
      }
    });
    const oneMonthBeforeTimestamp = +new Date() - 2592000000;
    const cardsAddPerWeek = Math.round(cards.filter(card => card.createdAt > oneMonthBeforeTimestamp).length / 4.34);
    const stats = [
      {
        name: 'Number of words',
        text: cards.length,
      }, {
        name: 'Cards Add Per Week',
        text: cardsAddPerWeek,
      }, {
        name: 'Forecast for the next 3 months',
        text: Math.round((cardsAddPerWeek * 4.34 * 3) + cards.length),
      }, {
        name: 'Groups',
        text: groups.length,
      }, {
        name: 'Cards prevision',
        text: `${cardPrevisionNextDay} ${cardPrevisionNext2Days}`,
      },
    ];
    return (<div
      className={`groups-stats ${isExpanded
        ? 'expanded'
        : ''}`}
      onClick={this.toggleExpand}
    >
      <div className="stats-container">
        {
          stats.map(stat => (<span key={stat.name} className="stat">{stat.name}
            <b>{stat.text}</b>
          </span>))
        }
      </div>
      <div ref={(i) => {
        this.chartContainer = i;
      }}
      />
    </div>);
  }
}

GropStats.propTypes = {
  hideOthersModals: PropTypes.any,
  activeGroup: PropTypes.any,
  close: PropTypes.any,
  position: PropTypes.any,
  cardsIsFetching: PropTypes.any,
  fetchCards: PropTypes.any,
  showEditGroup: PropTypes.any,
  startRevision: PropTypes.any,
};

const mapStateToProps = state => ({ cards: state.reforceCards.items, position: state.revision.position, groups: state.groups.items });

export default connect(mapStateToProps)(GropStats);
