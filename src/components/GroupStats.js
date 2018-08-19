/* global Highcharts, $, google */

import React from 'react';
import Axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { srsAlgo } from 'utils';
import moment from 'moment';

import Button from 'components/Button';
import GeneralStats from 'components/GeneralStats';

class GroupStats extends React.Component {
  constructor() {
    super();

    this.state = {
      isExpanded: false,
      content: false,
    };

    this.chart = false;
  }

  toggleExpand = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });

    if (!this.state.isExpanded)
      this.generateChart();
    else
      this.resetContent();
  }

  setContent = (Component) => {
    firebase.database().ref('/log/').once('value')
    .then(({ data }) => {
      if (this.chart) this.chart.destroy();

      this.setState({
        content: Component,
        log: data,
      });
    });
  }

  resetContent = () => {
    if (this.chart.hasRendered) this.chart.destroy();
    this.chart = false;

    this.setState({
      content: false,
    });
  }

  generateChart = () => {
    firebase.database().ref('/log/').once('value')
    .then(({ data }) => {
      this.draw3DChart(data.val());
    });
  }

  drawNextDaysChart = () => {
    this.resetContent();

    const data = [];

    const calcDayGroups = (day) => {
      let cardPrevision = 0;

      this.props.groups.forEach((group) => {
        const groupDomain = srsAlgo.calcGroupDomain(group.lastview, parseInt(group.repetitions, 10), 3600 * 24 * day * 1000);

        if (groupDomain === 1 && group.repetitions !== 0) {
          cardPrevision++;
        }
      });

      return [moment().add(day, 'd').valueOf(), cardPrevision];
    };

    for (let i = 0; i < 90; i++) {
      data.push(calcDayGroups(i));
    }

    Highcharts.theme = {};

    this.chart = Highcharts.chart(this.chartContainer, {
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        type: 'Combination chart',
      },
      title: {
        text: 'Groups prevision',
      },
      xAxis: {
        type: 'datetime',
        gridLineWidth: 1,
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b',
          year: '%b',
        },
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Groups',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        // pointFormat: `{point.key}{point.y}<br>`,
      },
      series: [
        {
          type: 'column',
          name: 'Groups by day',
          data,
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif',
            },
          },
        },
        // {
        //   type: 'spline',
        //   data,
        //   marker: {
        //     lineWidth: 2,
        //     lineColor: Highcharts.getOptions().colors[3],
        //     fillColor: 'white',
        //   },
        // },
      ],
    });
  }

  draw3DChart = (logs) => {
    this.resetContent();

    const data = logs.filter(log => (
      parseInt(log.repetitionsBeforeReview, 10) !== 0)
      && log.group.section_id === this.props.activeSection
    )
    .map(log => [
      parseInt(log.repetitionsBeforeReview, 10),
      Math.round(log.failureRate * 100),
      log.groupDomain,
    ]);

    Highcharts.theme = {
      chart: {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
          stops: [
                [0, '#2a2a2b'],
                [1, '#3e3e40'],
          ],
        },
        plotBorderColor: '#606063',
      },
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      title: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
          fontSize: '14px',
        },
      },
      subtitle: {
        style: {
          color: '#E0E0E3',
          textTransform: 'uppercase',
        },
      },
      xAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3',
          },
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#A0A0A3',

          },
        },
      },
      yAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3',
          },
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
          style: {
            color: '#A0A0A3',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
          color: '#F0F0F0',
        },
      },
      plotOptions: {
        series: {
          dataLabels: {
            color: '#B0B0B3',
          },
          marker: {
            lineColor: '#333',
          },
        },
        boxplot: {
          fillColor: '#505053',
        },
        candlestick: {
          lineColor: 'white',
        },
        errorbar: {
          color: 'white',
        },
      },
      legend: {
        itemStyle: {
          color: '#E0E0E3',
        },
        itemHoverStyle: {
          color: '#FFF',
        },
        itemHiddenStyle: {
          color: '#606063',
        },
      },
      credits: {
        style: {
          color: '#666',
        },
      },
      labels: {
        style: {
          color: '#707073',
        },
      },

      drilldown: {
        activeAxisLabelStyle: {
          color: '#F0F0F3',
        },
        activeDataLabelStyle: {
          color: '#F0F0F3',
        },
      },

      navigation: {
        buttonOptions: {
          symbolStroke: '#DDDDDD',
          theme: {
            fill: '#505053',
          },
        },
      },

       // scroll charts
      rangeSelector: {
        buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
            color: '#CCC',
          },
          states: {
            hover: {
              fill: '#707073',
              stroke: '#000000',
              style: {
                color: 'white',
              },
            },
            select: {
              fill: '#000003',
              stroke: '#000000',
              style: {
                color: 'white',
              },
            },
          },
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
          backgroundColor: '#333',
          color: 'silver',
        },
        labelStyle: {
          color: 'silver',
        },
      },

      navigator: {
        handles: {
          backgroundColor: '#666',
          borderColor: '#AAA',
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
          color: '#7798BF',
          lineColor: '#A6C7ED',
        },
        xAxis: {
          gridLineColor: '#505053',
        },
      },

      scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043',
      },

       // special colors for some of the
      legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
      background2: '#505053',
      dataLabelsColor: '#B0B0B3',
      textColor: '#C0C0C0',
      contrastTextColor: '#F0F0F3',
      maskColor: 'rgba(255,255,255,0.3)',
    };

    // Apply the theme
    Highcharts.setOptions(Highcharts.theme);

    Highcharts.setOptions({
      colors: Highcharts.getOptions().colors.map(color => ({
        radialGradient: {
          cx: 0.4,
          cy: 0.3,
          r: 0.5,
        },
        stops: [
          [0, color],
          [1, Highcharts.Color(color).brighten(-0.2).get('rgb')],
        ],
      })),
    });

    this.chart = Highcharts.chart(this.chartContainer, {
      chart: {
        type: 'scatter3d',
        margin: 100,
        options3d: {
          enabled: true,
          alpha: 10,
          beta: 30,
          depth: 250,
          viewDistance: 5,
          fitToPlot: false,
          frame: {
            bottom: {
              size: 1,
              color: 'rgba(0,0,0,0.06)',
            },
            back: {
              size: 1,
              color: 'rgba(0,0,0,0.08)',
            },
            side: {
              size: 1,
              color: 'rgba(0,0,0,0.1)',
            },
          },
        },
      },
      title: {
        text: 'WrongRate vs Repetitions vs GroupDomain',
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
        max: 100,
        min: 0,
        labels: {
          format: '{value}%',
        },
        title: {
          text: 'WrongRate',
        },
      },
      zAxis: {
        title: {
          text: 'GroupDomain',
        },
        // max: 10,
      },
      plotOptions: {
        scatter: {
          width: 10,
          height: 10,
          depth: 10,
        },
      },
      tooltip: {
        headerFormat: null,
        pointFormat: 'Repetitions: <b>{point.x}</b><br/>WrongRate: <b>{point.y}%</b><br/>GroupDomain: <b>{point.z}</b><br/>',
      },
      series: [
        {
          name: 'Repetitions/WrongRate/GroupDomain',
          colorByPoint: true,
          data,
        },
      ],
    });

    // Add mouse events for rotation
    // TODO: remove jquery
    $(this.chartContainer).on('mousedown.hc touchstart.hc', (eStart) => {
      eStart = this.chart.pointer.normalize(eStart); // eslint-disable-line

      const posX = eStart.chartX;
      const posY = eStart.chartY;
      const alpha = this.chart.options.chart.options3d.alpha;
      const beta = this.chart.options.chart.options3d.beta;
      let newAlpha;
      let newBeta;
      const sensitivity = 5; // lower is more sensitive

      $(document).on({
        'mousemove.hc touchmove.hc': (e) => {
                // Run beta
          e = this.chart.pointer.normalize(e); // eslint-disable-line
          newBeta = beta + ((posX - e.chartX) / sensitivity);
          this.chart.options.chart.options3d.beta = newBeta;

                // Run alpha
          newAlpha = alpha + ((e.chartY - posY) / sensitivity);
          this.chart.options.chart.options3d.alpha = newAlpha;

          this.chart.redraw(false);
        },
        'mouseup touchend': () => {
          $(document).off('.hc');
        },
      });
    });
  }

  render() {
    const { cards: AllCards, groups } = this.props;
    const { isExpanded, content, log } = this.state;


    const components = {
      GeneralStats,
    };

    const cards = AllCards.filter(({ lastView }) => lastView && lastView !== '');

    const Component = components[content];

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
      },
      {
        name: 'Cards Add Per Week',
        text: cardsAddPerWeek,
      },
      {
        name: 'Forecast for the next 3 months',
        text: Math.round((cardsAddPerWeek * 4.34 * 3) + cards.length),
      },
      {
        name: 'Groups',
        text: groups.length,
      },
      {
        name: 'Cards prevision',
        text: `${cardPrevisionNextDay} ${cardPrevisionNext2Days}`,
      },
    ];
    return (
      <div
        className={`groups-stats ${isExpanded
          ? 'expanded'
          : ''}`}
      >
        <div
          className="stats-container"
          onClick={this.toggleExpand}
        >
          {
            stats.map(stat => (
              <span key={stat.name} className="stat">{stat.name}&nbsp;<b>{stat.text}</b></span>
            ))
          }
        </div>
        <div className="chart-buttons">
          <Button
            label="Groups Stats"
            rounded
            size="small"
            onClick={this.generateChart}
          />
          <Button
            label="Groups prevision"
            rounded
            size="small"
            onClick={this.drawNextDaysChart}
          />
          <Button
            label="General Stats"
            rounded
            size="small"
            onClick={e => this.setContent('GeneralStats')}
          />
        </div>
        { content && <Component logs={log} /> }
        <div
          ref={(i) => { this.chartContainer = i; }}
        />
      </div>
    );
  }
}

GroupStats.propTypes = {
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
  cards: state.reforceCards.items,
  position: state.revision.position,
  groups: state.groups.items,
  activeSection: state.sections.active,
});

export default connect(mapStateToProps)(GroupStats);
