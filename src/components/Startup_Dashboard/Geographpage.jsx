// import React, { useState, useEffect } from 'react';
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
// import { styled } from '@mui/material/styles';
// import axios from 'axios';
// import StartupBanner from '../../images/Startup-SAMPLE.png';
// import Startupmap from './Startupmap';

// const Geographpage = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [apiData, setApiData] = useState({
//     startups: [],
//     industries: [],
//     sectors: []
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const tabs = [
//     { 
//       id: 0, 
//       label: 'Startups', 
//       content: 'Visualization for Startups',
//       apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/startupscountstates',
//       dataKey: 'startups'
//     },
//     { 
//       id: 1, 
//       label: 'Industries', 
//       content: 'Visualization for Industries',
//       apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/industriescount',
//       dataKey: 'industries'
//     },
//     { 
//       id: 2, 
//       label: 'Sectors', 
//       content: 'Visualization for Sectors',
//       apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/sectorscount',
//       dataKey: 'sectors'
//     },
//   ];

//   const fetchData = async (endpoint, dataKey) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(endpoint);
//       setApiData(prev => ({
//         ...prev,
//         [dataKey]: response.data
//       }));
//       setError(null);
//     } catch (err) {
//       setError(`Failed to fetch ${dataKey} data`);
//       console.error(`Error fetching ${dataKey} data:`, err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     const tab = tabs[newValue];
//     if (!apiData[tab.dataKey].length) {
//       fetchData(tab.apiEndpoint, tab.dataKey);
//     }
//   };

//   useEffect(() => {
//     // Load initial tab data
//     const initialTab = tabs[activeTab];
//     fetchData(initialTab.apiEndpoint, initialTab.dataKey);
//   }, []);

//   const TabContent = styled(Box)(({ theme }) => ({
//     padding: theme.spacing(2),
//     marginTop: theme.spacing(2),
//     backgroundColor: theme.palette.grey[100],
//     borderRadius: theme.shape.borderRadius,
//   }));

//   const renderMainContent = () => {
//     switch(activeTab) {
//       case 0: // Startups tab
//         return <Startupmap />;
//       case 1: // Industries tab
//         return (
//           <div>
//             <h3>Industries Visualization</h3>
//             <p>Content for industries visualization</p>
//           </div>
//         );
//       case 2: // Sectors tab
//         return (
//           <div>
//             <h3>Sectors Visualization</h3>
//             <p>Content for sectors visualization</p>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   const renderDataTable = () => {
//     if (loading) return <p>Loading data...</p>;
//     if (error) return <p>{error}</p>;
    
//     const currentTab = tabs[activeTab];
//     const data = apiData[currentTab.dataKey];
    
//     if (!data.length) return <p>No data available</p>;

//     // Determine column names based on active tab
//     const columns = activeTab === 0 
//       ? { name: 'state_name', count: 'count' }
//       : activeTab === 1
//       ? { name: 'industry_name', count: 'count' }
//       : { name: 'sector_name', count: 'count' };

//     return (
//       <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
//         <h3>{currentTab.label} Data</h3>
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#f5f5f5' }}>
//               <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
//                 {currentTab.label.slice(0, -1)}
//               </th>
//               <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Count</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item, index) => (
//               <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
//                 <td style={{ padding: '8px' }}>{item[columns.name]}</td>
//                 <td style={{ padding: '8px', textAlign: 'right' }}>{item[columns.count]}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Box sx={{ width: '100%', mb: 4, maxHeight: '100%', overflow: 'hidden' }}>
//         <img 
//           src={StartupBanner} 
//           alt="Startup Banner" 
//           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//         />
//       </Box>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={2}>
//           <Paper elevation={0} sx={{ 
//             p: 2,
//             borderRight: { md: '1px solid #ddd' },
//             pr: { md: 3 },
//             height: '100%'
//           }}>
//             <Tabs
//               value={activeTab}
//               onChange={handleTabChange}
//               orientation="vertical"
//               variant="fullWidth"
//               sx={{ borderRight: 1, borderColor: 'divider' }}
//             >
//               {tabs.map((tab) => (
//                 <Tab key={tab.id} label={tab.label} />
//               ))}
//             </Tabs>
//             <TabContent>
//               {tabs[activeTab].content}
//             </TabContent>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
//             {renderMainContent()}
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
//             {renderDataTable()}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Geographpage;

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import StartupBanner from '../../images/Startup-SAMPLE.png';
import Startupmap from './Startupmap';

const Geographpage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [apiData, setApiData] = useState([]); // Changed to single array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { 
      id: 0, 
      label: 'Startups', 
      content: 'Visualization for Startups',
      apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/startupscountstates',
      dataKey: 'state_name'
    },
    { 
      id: 1, 
      label: 'Industries', 
      content: 'Visualization for Industries',
      apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/industriescountstates',
      dataKey: 'industry_name'
    },
    { 
      id: 2, 
      label: 'Sectors', 
      content: 'Visualization for Sectors',
      apiEndpoint: 'https://development.stieahub.in/Codigniter_api/public/sectorscount',
      dataKey: 'sector_name'
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
      setApiData([]); // Reset data on error
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset data immediately when changing tabs
    setApiData([]);
  };

  useEffect(() => {
    // Fetch data whenever activeTab changes
    if (tabs[activeTab]) {
      fetchData(tabs[activeTab].apiEndpoint);
    }
  }, [activeTab]);

  const TabContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
  }));

  const renderMainContent = () => {
    switch(activeTab) {
      case 0: return <Startupmap />;
      case 1: return <div><h3>Industries Visualization</h3></div>;
      case 2: return <div><h3>Sectors Visualization</h3></div>;
      default: return null;
    }
  };

  const renderDataTable = () => {
    if (loading) return <p>Loading data...</p>;
    if (error) return <p>{error}</p>;
    if (!apiData.length) return <p>No data available</p>;

    const currentTab = tabs[activeTab];
    
    return (
      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {/* <h3>{currentTab.label} Data</h3> */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                {/* {currentTab.label.slice(0, -1)} */}
                States
              </th>
              <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Startups Count</th>
            </tr>
          </thead>
          <tbody>
            {apiData.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{item[currentTab.dataKey]}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Banner and Grid layout remains the same */}
      <Box sx={{ width: '100%', mb: 4, maxHeight: '100%', overflow: 'hidden' }}>
        {/* <img 
          src={StartupBanner} 
          alt="Startup Banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        /> */}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <Paper elevation={0} sx={{ 
            p: 2,
            borderRight: { md: '1px solid #ddd' },
            pr: { md: 3 },
            height: '100%'
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              orientation="vertical"
              variant="fullWidth"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.id} label={tab.label} />
              ))}
            </Tabs>
            <TabContent>
              {tabs[activeTab].content}
            </TabContent>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
            {renderMainContent()}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2, height: '100%' }}>
            {renderDataTable()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Geographpage;