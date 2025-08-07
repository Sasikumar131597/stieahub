import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';

// Hardcoded manual values for the chart
const MANUAL_DATA = [
  { name: 'Publications', value: 21.5, color: '#0088FE' },
  { name: 'Patent Records', value: 78.5, color: '#FF8042' }
];

function PieGraph() {
  const chartRef = useRef(null);

  useEffect(function () {
    const gradientColors = MANUAL_DATA.map((data, idx) => {
      const userColor = data.color || Highcharts.getOptions().colors[idx % Highcharts.getOptions().colors.length];
      return {
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        stops: [
          [0, userColor],
          [1, Highcharts.color(userColor).brighten(-0.3).get('rgb')]
        ]
      };
    });

    const chart = Highcharts.chart(chartRef.current, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 180
      },
      title: { text: undefined },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f}%',
            distance: -30, // Position on top of slice
            style: {
              fontSize: '13px',
              fontWeight: 'bold',
              color: 'white',
              textOutline: '1px contrast'
            }
          }
        }
      },
      series: [{
        name: 'Share',
        colorByPoint: false,
        data: MANUAL_DATA.map((item, idx) => ({
          name: item.name,
          y: item.value,
          color: gradientColors[idx]
        }))
      }]
    });

    // return () => {
    //   if (chart) chart.destroy();
    // };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: 200 }} />;
}

export default PieGraph;


