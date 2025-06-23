import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown';

// Initialize the drilldown module
drilldown(Highcharts);

const TopSectorChart = () => {
  const [chartOptions, setChartOptions] = useState({
    chart: { type: 'column' },
    title: { text: 'Loading data...' },
    series: [{ data: [] }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://development.stieahub.in/Codigniter_api/public/toptensectors');
        const data = await response.json();

        if (!data.data) {
          throw new Error('Invalid data format from API');
        }

        const sectorsData = data.data.map(item => ({
          name: item.sector_name,
          y: parseInt(item.count),
          drilldown: item.sector_id // Using sector ID as drilldown ID
        }));

        setChartOptions({
          chart: {
            type: 'column',
            height: '600px' // Adjust height as needed
          },
          title: {
            text: 'Top Sectors by Count'
          },
          subtitle: {
            text: 'Source: <a href="https://development.stieahub.in" target="_blank">STIEA Hub</a>'
          },
          accessibility: {
            announceNewData: {
              enabled: true
            }
          },
          xAxis: {
            type: 'category',
            labels: {
              rotation: -45, // Rotate labels if they're long
              style: {
                fontSize: '12px'
              }
            }
          },
          yAxis: {
            title: {
              text: 'Number of Entries'
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: '{point.y:.0f}',
                style: {
                  fontSize: '12px'
                }
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: ' +
              '<b>{point.y:.0f}</b> entries<br/>'
          },
          series: [{
            name: 'Sectors',
            colorByPoint: true,
            data: sectorsData
          }],
          drilldown: {
            breadcrumbs: {
              position: {
                align: 'right'
              }
            },
            series: [
              // Placeholder for drilldown data
              // You would add this if you have hierarchical data
              // Example:
              // {
              //   name: 'Food Processing',
              //   id: '7',
              //   data: [
              //     ['Sub-category 1', 2000],
              //     ['Sub-category 2', 1500],
              //     // ...
              //   ]
              // }
            ]
          },
          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                plotOptions: {
                  series: {
                    dataLabels: {
                      enabled: false
                    }
                  }
                }
              }
            }]
          }
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
        setChartOptions({
          title: { text: 'Error loading data' },
          subtitle: { text: err.message }
        });
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="sector-chart-container">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        containerProps={{ style: { width: '100%', height: '100%' } }}
      />
    </div>
  );
};

export default TopSectorChart;