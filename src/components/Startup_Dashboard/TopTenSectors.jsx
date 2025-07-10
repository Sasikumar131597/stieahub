import React from 'react';
import ReactApexChart from 'react-apexcharts';

const TopTenSectors = () => {
  const [state, setState] = React.useState({
    series: [{
      name: 'Count',
      data: []
    }],
    options: {
      chart: {
        height: 500,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          horizontal: false,
          columnWidth: '55%',
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toLocaleString();
        },
        offsetY: -25,
        style: {
          fontSize: '12px',
          colors: ["#304758"],
          fontWeight: 'bold'
        }
      },
      xaxis: {
        categories: [],
        position: 'bottom',
        axisBorder: {
          show: true,
          color: '#78909C',
          height: 1,
          width: '100%',
          offsetX: 0,
          offsetY: 0
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#78909C',
          height: 6,
          offsetX: 0,
          offsetY: 0
        },
        labels: {
          style: {
            colors: '#424242',
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
          },
          rotate: -45,
          trim: true,
          hideOverlappingLabels: true
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        show: true,
        axisBorder: {
          show: true,
          color: '#78909C',
          width: 1,
          offsetX: 0,
          offsetY: 0
        },
        labels: {
          formatter: function(val) {
            return val.toLocaleString();
          },
          style: {
            colors: '#424242',
            fontSize: '12px',
          }
        }
      },
      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      
      tooltip: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
        },
        theme: 'dark', // This makes the tooltip black/dark
        y: {
          formatter: function(val) {
            return val.toLocaleString();
          }
        }
      },
      colors: ['#3f51b5']
    }
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://development.stieahub.in/Codigniter_api/public/toptensectors');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          const categories = data.data.map(item => item.sector_name);
          const seriesData = data.data.map(item => parseInt(item.count));
          
          setState(prevState => ({
            ...prevState,
            series: [{
              ...prevState.series[0],
              data: seriesData
            }],
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: categories
              }
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
      <ReactApexChart 
        options={state.options} 
        series={state.series} 
        type="bar" 
        height={500} 
      />
    </div>
  );
};

export default TopTenSectors;