import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';

// Hardcoded manual values for the chart
const MANUAL_DATA = [
  { name: 'Publications', value: 30, color: '#0088FE' },
  { name: 'Patents', value: 70, color: '#FF8042' }
];

function PieGraph() {
  const chartRef = useRef(null);

  useEffect(function () {
    var gradientColors = MANUAL_DATA?.map(function (data, idx) {
      var userColor = data?.color || Highcharts?.getOptions()?.colors[idx % Highcharts?.getOptions()?.colors?.length];
      return {
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        stops: [
          [0, userColor],
          [1, Highcharts?.color(userColor)?.brighten(-0.3)?.get('rgb')]
        ]
      };
    });

    var chart = Highcharts?.chart(chartRef?.current, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 180
      },
      title: { text: undefined },
      tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b>' },
      accessibility: { point: { valueSuffix: '%' } },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            format:
              '<span style="font-size:1.1em"><b>{point.name}</b></span><br>' +
              '<span style="opacity:0.7">{point.percentage:.1f}%</span>',
            connectorColor: '#888'
          }
        }
      },
      series: [{
        name: 'Share',
        colorByPoint: false,
        data: MANUAL_DATA?.map(function (item, idx) {
          return {
            name: item?.name,
            y: item?.value,
            color: gradientColors[idx]
          };
        })
      }]
    });

    // return function () {
    //   if (chart) chart?.destroy();
    // };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: 200 }} />;
}

export default PieGraph;

