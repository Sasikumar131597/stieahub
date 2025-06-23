import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const TopSectors = () => {
  const [chartOptions, setChartOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://development.stieahub.in/Codigniter_api/public/toptensectors');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json();

        // Process API data for the chart
        const chartData = apiData.data.map(item => ({
          name: item.sector_name,
          y: parseInt(item.count)
        }));

        const options = {
          chart: {
            type: 'column',
            height: 500 // Adjust height as needed
          },
           title: {
            text: 'Top 10 Sectors'
          },
          xAxis: {
            type: 'category',
            labels: {
              autoRotation: [-45, -90],
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }

            // min: 0,
            // title: {
            //   text: 'Sectors'
            // }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Count'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: 'Count: <b>{point.y:,0f}</b>'
          },
          series: [{
            name: 'Count',
            colors: [
              '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
              '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
              '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
              '#03c69b', '#00f194'
            ],
            colorByPoint: true,
            groupPadding: 0,
            data: chartData,
            dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#FFFFFF',
              inside: true,
              verticalAlign: 'top',
              format: '{point.y:,0f}',
              y: 10,
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          }],
          credits: {
            enabled: false
          }
        };

        setChartOptions(options);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        {/* <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Top Sectors Distribution</h3>
        </div> */}
        <div className="card-body">
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default TopSectors;