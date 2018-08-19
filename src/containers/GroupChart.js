/* global Highcharts, $, google */ // eslint-disable-line
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setModalVisibility, hideOthersModals } from 'actions/modalsActions';
import Button from 'components/Button';
import { objectToArray } from '../utils';

class GroupChart extends React.Component {
  componentWillMount() {
    this.props.hideOthersModals();
  }

  componentDidMount() {
    firebase.database().ref('/log/').once('value')
    .then((data) => {
      this.drawChart(objectToArray(data.val()));
    });
  }

  componentWillUnmount() {
    if (this.chart) this.chart.destroy();
  }

  drawChart(logs) {
    const filtered = logs
    .filter(log => log.group.name === this.props.activeGroup.name) // eslint-disable-line

    const data = filtered.map(log => [
      log.created,
      parseInt(log.repetitionsBeforeReview, 10),
    ]);

    const data2 = filtered.map(log => [
      log.created,
      Math.round(log.failureRate * 100),
    ]);

    this.chart = Highcharts.chart(this.chartContainer, {
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        // width: '800px',
      },
      title: {
        text: 'Group revisions',
      },
      xAxis: {
        type: 'datetime',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b',
          year: '%b',
        },
        crosshair: true,
      },
      yAxis: [
        {
          title: {
            text: 'Repetitions',
            allowDecimals: false,
          },
          tickInterval: 1,
        },
        {
          title: {
            text: 'Domain',
          },
          labels: {
            format: '{value}%',
          },
          opposite: true,
          // tickInterval: 10,
          min: 0,
          max: 101,
        },
      ],
      legend: {
        // enabled: false,
      },
      tooltip: {
        shared: true,
        // pointFormat: '{point.y}<br>',
      },
      series: [
        {
          name: 'Repetitions',
          data,
          yAxis: 0,
        },
        {
          name: 'FailureRate',
          data: data2,
          yAxis: 1,
          tooltip: {
            valueSuffix: ' %',
          },
        },
      ],
    });
  }

  render() {
    const { close } = this.props;

    return (
      <div className="modal-box" style={{ width: '800px' }}>
        <div ref={(i) => { this.chartContainer = i; }} />

        <div className="bottom-buttons">
          <Button
            label="CLOSE"
            type="flat"
            alignRight
            onClick={close}
          />
        </div>
      </div>
    );
  }
}

GroupChart.propTypes = {
  hideOthersModals: PropTypes.any,
  close: PropTypes.any,
  errorMsg: PropTypes.any,
};

const mapStateToProps = state => ({
  errorMsg: state.error,
  activeGroup: state.groups.active === 'REFORCE'
    ? false
    : state.groups.items.find(group => group.id === state.groups.active),
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(setModalVisibility('GroupChart', false)),
  hideOthersModals: () => dispatch(hideOthersModals(['GroupChart', 'RevisionDialog'])),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupChart);
