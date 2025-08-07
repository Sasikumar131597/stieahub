import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container, 
  Box,
  Typography,
  Card
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { 
  ResponsiveContainer, 
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

// Styled NavButton
const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  margin: theme.spacing(0, 1),
  '&.active': {
    fontWeight: 'bold',
    borderBottom: '2px solid white'
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

// Styled TitleButton
const TitleButton = styled(Button)(({ theme }) => ({
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'transparent'
  }
}));


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
    { year: '2015', Patents: 1357},
    { year: '2016', Patents: 1880},
    { year: '2017', Patents: 2391},
    { year: '2018', Patents: 3355},
    { year: '2019', Patents: 4713},
    { year: '2020', Patents: 5906},
    { year: '2021', Patents: 7572},
    { year: '2022', Patents: 8576},
    { year: '2023', Patents: 9163},
    { year: '2024', Patents: 10428}
  ];

  const lineChartgrowthdata = [
    { year: '2015', Patents: 5.44 },
    { year: '2016', Patents: 38.54},
    { year: '2017', Patents: 27.18},
    { year: '2018', Patents: 40.32},
    { year: '2019', Patents: 40.48},
    { year: '2020', Patents: 25.31},
    { year: '2021', Patents: 28.21},
    { year: '2022', Patents: 13.26},
    { year: '2023', Patents: 6.84},
    { year: '2024', Patents: 13.81}
  ];

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

  const renderLineChartCard = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
        Publications and Patents Trend (2015-2024)
      </Typography>
      <Typography variant="p">
        Here we look at research papers published and patent applications for UAV technology between years 2015 and 2024.
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
              dataKey="Patents" 
              stroke="#FF8042" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
              name="Patents"
            />
          </LineChart>
          
        </ResponsiveContainer>
      </Box>
      <span>Data : Source :</span>
    </LargeDashboardCard>
  );

  const renderLineChartgrowth = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
        Publications growth rate (2015-2024)
      </Typography>
      <Typography variant="p">
        Here we look at research papers published and patent applications for UAV technology between years 2015 and 2024.
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineChartgrowthdata}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<LineChartTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Patents" 
              stroke="#FF8042" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
              name="Patents"
            />
          </LineChart>
          
        </ResponsiveContainer>
      </Box>
      <span>Data : Source :</span>
    </LargeDashboardCard>
  );

const Patents = () => {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#5f6f80', mb: 3 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <TitleButton 
              onClick={() => navigate('/ctt_dashboard')}
              disableRipple
            >
              Critical Technology Tracker
            </TitleButton>
            
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <NavButton onClick={() => navigate('/')}>Home</NavButton>
              <NavButton onClick={() => navigate('/about')}>About Us</NavButton>
              <NavButton onClick={() => navigate('/faq')}>FAQ</NavButton>
              <NavButton onClick={() => navigate('/contact')}>Contact</NavButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

     <Grid container spacing={2} style={{padding:"15px"}}>
      <Grid item size={12}>
        <h6>Description</h6>
        <p>
          Unlock valuable insights into user behavior and preferences through our comprehensive user analysis, empowering your decision-making with data-driven strategies.
        </p>
      </Grid>

      <Grid item size={12}>
        <h6>Temporal Trends in Research Publications</h6>
        <p>See how knowledge creation has accelerated over time.</p>
      </Grid>

      <Grid item size={12}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            {renderLineChartCard()}
          </Grid>
          <Grid item size={6} >
            {renderLineChartgrowth()}
          </Grid>
        </Grid>
      </Grid>
    </Grid>

           
    </>
  );
};

export default Patents;
