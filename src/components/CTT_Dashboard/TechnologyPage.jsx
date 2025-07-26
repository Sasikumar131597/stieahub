import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Button,
  Card,
  Typography,
  styled,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

import PieGraph from './PieGraph';
import PopulationChart from './PopulationChart';
// import EastIcon from '@mui/icons-material/East';
import { FaArrowRight } from "react-icons/fa";

// Styled components
const TitleButton = styled(Button)({
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent'
  }
});

const NavButton = styled(Button)({
  color: 'white',
  textTransform: 'none',
  marginLeft: '10px',
  '&.active': {
    borderBottom: '2px solid white'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
});

const DashboardCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '200px',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const LargeDashboardCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '400px',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const StatCardContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1
});

const RatioCardContent = styled(Box)({
  display: 'flex',
  height: '100%'
});

const LeftContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '40%',
  justifyContent: 'space-between'
});

const ChartWrapper = styled(Box)({
  width: '60%',
  height: '100%',
  minHeight: '150px'
});

const LegendItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px'
});

const LegendColor = styled(Box)(({ color }) => ({
  width: '12px',
  height: '12px',
  backgroundColor: color,
  marginRight: '8px',
  borderRadius: '2px'
}));

const HeaderRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '16px'
});

const DropdownContainer = styled(Box)({
  display: 'flex',
  gap: '16px'
});

const TechnologyPage = () => {
  const navigate = useNavigate();
  const [globalCountry, setGlobalCountry] = useState('');
  const [indiaRegion, setIndiaRegion] = useState('');

  // Data for cards
  const cardData = [
    {
      title: 'Publications',
      count: 56016,
      image: 'https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/Publications.jpeg'
    },
    {
      title: 'Patents',
      count: 8920,
      image: 'https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/Patents.jpeg'
    },
    {
      title: 'Publications/Patents Ratio',
      count: 42,
      image: 'https://development.stieahub.in/Codigniter_api/public/assets/images/Industry_imgs/3.png'
    }
  ];

  // Pie chart data
  const pieData = [
    { name: 'Publications', value: 30, color: '#0088FE' },
    { name: 'Patents', value: 70, color: '#FF8042' }
  ];

  // Countries & Regions
  const countries = ['United States', 'China', 'United Kingdom', 'Australia'];
  const indiaRegions = ['India'];

  const handleGlobalCountryChange = (event) => {
    setGlobalCountry(event.target.value);
  };

  const handleIndiaRegionChange = (event) => {
    setIndiaRegion(event.target.value);
  };

  const renderStatCard = (data) => (
    <DashboardCard>
      <StatCardContent>
        <Box
          component="img"
          sx={{ width: 100, height: 100, mr: 2 }}
          src={data?.image}
          alt={data?.title}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
            {data?.title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {data?.count.toLocaleString()}
          </Typography>
        </Box>
        
      </StatCardContent>
      <div style={{display:"flex",justifyContent:"right"}}>
          <FaArrowRight />
        </div>
    </DashboardCard>
  );

  const renderRatioCard = () => (
    <DashboardCard>
      <RatioCardContent>
        <LeftContent>
          <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
            Publications/Patents Ratio
          </Typography>
          <Box>
            {pieData?.map((item, index) => (
              <LegendItem key={index}>
                <LegendColor color={item?.color} />
                <Typography variant="body2">
                  {item?.name}: {item?.value}%
                </Typography>
              </LegendItem>
            ))}
          </Box>
        </LeftContent>
        <ChartWrapper>
          <PieGraph chartData={pieData} />
        </ChartWrapper>
      </RatioCardContent>
    </DashboardCard>
  );

  const LineChartTooltip = ({ active, payload }) => {
  if (active && payload && payload?.length) {
    return (
      <Box sx={{ 
        backgroundColor: 'white', 
        padding: '8px', 
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: 1,
      }}>
        <Typography variant="body2">{`Year: ${payload[0]?.payload?.year}`}</Typography>
        {payload?.map((item, index) => (
          <Typography key={index} variant="body2" color={item?.color}>
            {`${item?.name}: ${item?.value}`}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};
  
    const lineChartData = [
    { year: '2015', publications: 200, patents: 500 },
    { year: '2016', publications: 300, patents: 600 },
    { year: '2017', publications: 400, patents: 800 },
    { year: '2018', publications: 450, patents: 1000 },
    { year: '2019', publications: 600, patents: 1200 },
    { year: '2020', publications: 800, patents: 1500 },
    { year: '2021', publications: 900, patents: 1800 },
    { year: '2022', publications: 1000, patents: 2000 },
    { year: '2023', publications: 1100, patents: 2200 },
    { year: '2024', publications: 1245, patents: 2500 }
  ];

    const renderLineChartCard = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
        Publications and Patents Trend (2015-2024)
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<LineChartTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="publications" 
              stroke="#0088FE" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
              name="Publications"
            />
            <Line 
              type="monotone" 
              dataKey="patents" 
              stroke="#FF8042" 
              strokeWidth={2}
              name="Patents"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </LargeDashboardCard>
  );

  return (
    <div>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: '#5f6f80', mb: 3 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <TitleButton onClick={() => navigate('/ctt_dashboard')} disableRipple>
              Critical Technology Tracker
            </TitleButton>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <NavButton onClick={() => navigate('')}>Home</NavButton>
              <NavButton onClick={() => navigate('')}>About Us</NavButton>
              <NavButton onClick={() => navigate('')}>FAQ</NavButton>
              <NavButton onClick={() => navigate('')}>Contact</NavButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Stats Grid Section */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <HeaderRow>
          <Typography variant="h4" fontWeight="bold">
            Unmanned Aerial Vehicle (UAV)
          </Typography>
          <DropdownContainer>
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel>Global</InputLabel>
              <Select value={globalCountry} onChange={handleGlobalCountryChange} label="Global">
                <MenuItem value="">
                  <em>Select Country</em>
                </MenuItem>
                {countries?.map((country, index) => (
                  <MenuItem key={index} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel>India</InputLabel>
              <Select value={indiaRegion} onChange={handleIndiaRegionChange} label="India">
                <MenuItem value=""></MenuItem>
                {indiaRegions?.map((region, index) => (
                  <MenuItem key={index} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DropdownContainer>
        </HeaderRow>

        <Grid container spacing={3} alignItems="stretch">
          {/* Publications Card */}
          <Grid size={3}>
            {renderStatCard(cardData[0])}
          </Grid>

          {/* Patents Card */}
          <Grid size={3}>
            {renderStatCard(cardData[1])}
          </Grid>

          {/* Ratio Card */}
          <Grid size={6}>
            {renderRatioCard()}
          </Grid>
        </Grid>

        {/* Description */}
          <Grid size={12}>
            <Box
              sx={{
                padding: '15px',
                backgroundColor: 'aliceblue',
                borderRadius: '10px',
                marginTop: '10px',
                // marginLeft: '20px'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="p">
                An unmanned/uncrewed aerial vehicle (UAV) can be defined as a powered aircraft or flying
                vehicle that lacks a traditional human operator and can be controlled autonomously or via a
                remote control. It relies on aerodynamic forces for lift, uses battery or gas-powered engines
                to fly, and is capable of carrying both lethal and nonlethal payloads. By virtue of being
                uncrewed and hence unimpeded by the design-safety requirements of a crewed aircraft, UAVs
                can be seen as efficient and flexible than their traditional counterparts. Early on in their
                development, UAVs were confined to military operations but over time their usage has expanded
                to include various modern uses such as air-quality sampling, precision agriculture, traffic
                management, medical & essential supply deliveries and forest surveillance. Due to such a vast
                array of applications and further scope of development, UAVs represent a critical technology
                for India’s national interests.
              </Typography>
            </Box>
          </Grid>

          {/* You can add LineChart or other cards here */}
          {/* Line Chart Card */}
        <Grid container spacing={1} style={{marginTop:"10px"}}>
            <Grid size={12}>
             {renderLineChartCard()}
           </Grid>
        </Grid>

        <PopulationChart />
      </Container>
    </div>
  );
};

export default TechnologyPage;

