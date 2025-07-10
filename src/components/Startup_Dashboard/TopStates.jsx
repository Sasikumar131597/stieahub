import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const TopStates = ({ apiUrl, chartTitle = 'Top 10 States Based on No.of Startups', height = 500 }) => {
  const [chartData, setChartData] = useState({
    series: [{ data: [] }],
    options: {
      legend: { show: false },
      chart: { height, type: 'treemap' },
      // title: { text: chartTitle },
      // colors: [
      //   '#3B93A5', '#F7B844', '#ADD8C7', '#EC3C65', '#CDD7B6',
      //   '#C1F666', '#D43F97', '#1E5D8C', '#421243', '#7F94B0'
      // ],
      colors: [
        '#3B93A5', '#4983A8', '#7D6EAB', '#5063A7', '#7E8966',
        '#BD73BE', '#7F4295', '#1E5D8C', '#421243', '#7F94B0'
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false
        }
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://development.stieahub.in/Codigniter_api/public/toptenstates");
        const data = await response.json();
        
        const formattedData = data.data.map(item => ({
          x: item.state_name,
          y: parseInt(item.count)
        }));

        setChartData(prev => ({
          ...prev,
          series: [{ data: formattedData }]
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div id="chart">
      <ReactApexChart 
        options={chartData.options} 
        series={chartData.series} 
        type="treemap" 
        height={height} 
      />
    </div>
  );
};

export default TopStates;