import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/drilldown';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  maxWidth: '900px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const stagesContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
  marginTop: '20px'
};

const stageCardStyle = {
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const stageTitleStyle = {
  color: '#2c3e50',
  marginTop: '0',
  marginBottom: '10px',
  fontSize: '1rem',
  fontWeight: '600'
};

const stageDescriptionStyle = {
  color: '#34495e',
  fontSize: '0.9rem',
  lineHeight: '1.5'
};

const chartTitleStyle = {
    fontSize: '1.2em',
    fontWeight: 'bold',
    fill: 'rgb(51, 51, 51)',
    textAlign: 'center'
};

const StagePiechart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stageDescriptions = {
    'IDEATION': 'Where the entrepreneur has an interesting idea and is working on bringing it to life.',
    'VALIDATION': 'Where the startup has been established, it is time to enter the market to grasp the first ever set of customers.',
    'EARLY TRACTION': 'Where the startup has established a mark with the first wave of customers and KPIs take an important place in the growth model.',
    'SCALING': 'Where the startup has successfully achieved the product-market fit and crossed the valley of death for the startup to expand/raise capital.',
    'NA': 'Not specified or not applicable'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://development.stieahub.in/Codigniter_api/public/natureofpiechart');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        const processedData = {
          series: [{
            name: '',
            colorByPoint: true,
            data: data.data.map(item => ({
              name: item.stage_name,
              y: parseInt(item.count),
              description: stageDescriptions[item.stage_name]
            }))
          }]
        };
        
        setChartData(processedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'pie',
      height: '400px',
      backgroundColor: 'transparent',
      style: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    accessibility: {
      announceNewData: {
        enabled: true
      },
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          distance: -30, // Negative value brings labels inside slices
          format: '{point.percentage:.1f}%', // Show percentage only
          style: {
            color: 'white',
            textOutline: 'none',
            fontWeight: 'bold',
            fontSize: '14px'
          },
          connectorWidth: 0 // Hide connector lines
        },
        showInLegend: true, // Show legend instead of labels
        borderWidth: 2,
        borderColor: '#fff'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size: 13px"><b>{point.key}</b></span><br/>',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{point.y}</b> ({point.percentage:.1f}%)<br/>',
      style: {
        fontSize: '14px'
      },
      backgroundColor: '#ffffff',
      borderColor: '#e0e0e0',
      borderRadius: 8,
      shadow: true
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: '#333',
        fontWeight: 'normal'
      },
      itemHoverStyle: {
        color: '#000'
      }
    }
  };

  if (loading) return <div style={containerStyle}>Loading chart data...</div>;
  if (error) return <div style={containerStyle}>Error loading data: {error}</div>;

  return (
    <div style={containerStyle}>
      <h3 style={chartTitleStyle}>Startup Stages Distribution</h3>
      
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          ...chartOptions,
          series: chartData?.series
        }}
      />
      
      <div style={stagesContainerStyle}>
        {chartData?.series[0].data.filter(stage => stage.name !== 'NA').map((stage, index) => (
          <div key={index} style={stageCardStyle}>
            <h3 style={stageTitleStyle}>{stage.name}</h3>
            <p style={stageDescriptionStyle}>{stage.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StagePiechart;