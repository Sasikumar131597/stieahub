import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Startupmap from './Startupmap';
import Industrymap from './Industrymap';
import SectorMap from './SectorMap';
import { AppBar, Toolbar, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Geographpage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    { 
      id: 0, 
      label: 'Startups', 
      content: 'Geographical distribution of startups across India',
      apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/startupscountstates',
      dataKey: 'state_name'
    },
    { 
      id: 1, 
      label: 'Industries', 
      content: 'Industrial presence mapped across states',
      apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/industriescountstates',
      dataKey: 'state_name'
    },
    { 
      id: 2, 
      label: 'Sectors', 
      content: 'Sector-wise distribution analysis',
      apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/sectorscountstates',
      dataKey: 'state_name'
    },
  ];

  const fetchData = async (endpoint) => {
    setLoading(true);
    try {
      const response = await axios.get(endpoint);
      setApiData(response.data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch data`);
      console.error(`Error fetching data:`, err);
      setApiData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setApiData([]);
  };

  useEffect(() => {
    if (tabs[activeTab]) {
      fetchData(tabs[activeTab].apiEndpoint);
    }
  }, [activeTab]);

  const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: '#555',
    transition: 'all 0.3s ease',
    borderRadius: '4px',
    '&.Mui-selected': {
      color: '#1976d2',
      fontWeight: theme.typography.fontWeightMedium,
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
    '&:hover': {
      color: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.12)',
      transform: 'translateX(2px)',
    },
    '&:active': {
      backgroundColor: 'rgba(25, 118, 210, 0.16)',
    },
  }));

  const DataTableContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    height: '100%',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    '& h3': {
      color: '#1976d2',
      marginBottom: theme.spacing(2),
      paddingBottom: theme.spacing(1),
      borderBottom: '1px solid #eee'
    }
  }));

  const MapContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f5f7fa'
  }));

  const NavButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(0, 1),
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&.active': {
      borderBottom: '2px solid #fff',
    }
  }));

  const renderMainContent = () => {
    switch(activeTab) {
      case 0: return <Startupmap data={apiData} />;
      case 1: return <Industrymap data={apiData} />;
      case 2: return <SectorMap data={apiData} />;
      default: return null;
    }
  };

  const renderDataTable = () => {
    if (loading) return <Box sx={{ p: 2, textAlign: 'center', color: '#666' }}>Loading data...</Box>;
    if (error) return <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>;
    if (!apiData.length) return <Box sx={{ p: 2, textAlign: 'center', color: '#666' }}>No data available</Box>;

    const currentTab = tabs[activeTab];
    
    return (
      <Box sx={{ maxHeight: '450px', overflow: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontFamily: 'Arial, sans-serif'
        }}>
          <thead>
            <tr style={{ 
              backgroundColor: '#f5f5f5',
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                borderBottom: '1px solid #ddd',
                fontWeight: '600',
                color: '#333'
              }}>
                States
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'right', 
                borderBottom: '1px solid #ddd',
                fontWeight: '600',
                color: '#333'
              }}>
                No. of {currentTab.label} 
              </th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((item, index) => (
              <tr key={index} style={{ 
                borderBottom: '1px solid #eee',
                '&:hover': {
                  backgroundColor: '#f9f9f9'
                }
              }}>
                <td style={{ padding: '12px', color: '#444' }}>{item[currentTab.dataKey]}</td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#1976d2', fontWeight: '500' }}>
                  {item.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      {/* Navigation Bar */}
<AppBar position="static" sx={{ backgroundColor: '#5f6f80ff', mb: 3 }}>
  <Container maxWidth="xl">
    <Toolbar disableGutters>
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <NavButton 
          onClick={() => navigate('/startup_dashboard')}
        >
          Home
        </NavButton>
        <NavButton 
          onClick={() => navigate('/startup_dashboard/industries')}
        >
          Industries
        </NavButton>
        <NavButton 
          onClick={() => navigate('/startup_dashboard/geography')}
        >
          Geography
        </NavButton>
      </Box>
    </Toolbar>
  </Container>
</AppBar>

      <Container maxWidth="xl" sx={{ p: 3 }}>
        <h3 style={{ fontWeight: "bold" }}>The Geographic Startup Landscape</h3>
        <p style={{marginBottom: "1rem" }}>Explore the geographical distribution of startups across India. Select any region to view detailed insights and discover the dominant industries and sectors that power its local ecosystem.</p>

        <Grid container spacing={3}>
          {/* Left Sidebar - Tabs */}
          <Grid item xs={12} md={2}>
            <Paper elevation={0} sx={{ 
              p: 2,
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              backgroundColor: 'white'
            }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                orientation="vertical"
                variant="scrollable"
                sx={{
                  '& .MuiTabs-indicator': {
                    left: 0,
                    width: '3px',
                    backgroundColor: '#1976d2'
                  }
                }}
              >
                {tabs.map((tab) => (
                  <StyledTab 
                    key={tab.id} 
                    label={tab.label} 
                    sx={{
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      mb: 1
                    }}
                  />
                ))}
              </Tabs>
            </Paper>
          </Grid>

          {/* Main Content - Map */}
          <Grid item xs={12} md={6}>
            <MapContainer elevation={0}>
              {renderMainContent()}
            </MapContainer>
            <p style={{fontSize:"12px",textAlign:"center"}} ><b>Source:</b>Data on the geographical distribution of startups are from DPIIT (Startup India).</p>
          </Grid>

          {/* Right Sidebar - Data Table */}
          <Grid item xs={12} md={4}>
            <DataTableContainer elevation={0}>
              {renderDataTable()}
            </DataTableContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Geographpage;