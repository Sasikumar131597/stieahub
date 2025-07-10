import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import axios from 'axios';

const StagePiechart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://development.stieahub.in/Codigniter_api/public/natureofpiechart');
        const apiData = response.data.data;
        
        const transformedData = apiData.map(item => ({
          name: item.stage_name,
          y: parseInt(item.count),
          sliced: item.stage_name === 'VALIDATION',
          selected: item.stage_name === 'VALIDATION'
        }));
        
        setChartData(transformedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && chartData && chartContainerRef.current && !chartInstance.current) {
      chartInstance.current = Highcharts.chart(chartContainerRef.current, {
        chart: {
          type: 'pie',
          zooming: {
            type: 'xy'
          },
          panning: {
            enabled: true,
            type: 'xy'
          },
          panKey: 'shift'
        },
        title: {
          text: 'Stage of Startup'
        },
        tooltip: {
          formatter: function() {
            return `<b>${this.point.name}</b><br/>Count: <b>${this.point.y}</b>`;
          }
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: [{
              enabled: true,
              distance: 20,
              format: '{point.name}: {point.y}',
              style: {
                fontWeight: 'bold'
              }
            }, {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.0f}%',
              style: {
                fontSize: '1.2em',
                textOutline: 'none',
                opacity: 0.7,
                fontWeight: 'bold',
                color: 'white'
              },
              filter: {
                operator: '>',
                property: 'percentage',
                value: 10
              }
            }],
            showInLegend: true
          }
        },
        series: [{
          name: 'Count',
          colorByPoint: true,
          data: chartData
        }]
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [loading, chartData]);

  if (loading) return <div>Loading chart data...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return <div ref={chartContainerRef} style={{ width: '100%', height: '600px' }} />;
};

export default StagePiechart;