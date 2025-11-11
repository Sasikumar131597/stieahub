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
import Publication_Bar from "./Publication_Bar";
import GlobalSynergy from "./GlobalSynergy";
import Switch from '@mui/material/Switch';
import TopTenPublications from "./TopTenPublications";
import TopTenPublicBar from "./TopTenPublicBar";

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

const NavButton2 = styled(Button)(({ theme }) => ({
  color: 'black',
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
  { year: "2015", publications: 1357, patents: 500, citations: 2000 },
  { year: "2016", publications: 1880, patents: 650, citations: 2400 },
  { year: "2017", publications: 2391, patents: 820, citations: 2900 },
  { year: "2018", publications: 3355, patents: 1100, citations: 3600 },
  { year: "2019", publications: 4713, patents: 1450, citations: 4300 },
  { year: "2020", publications: 5906, patents: 1700, citations: 5100 },
  { year: "2021", publications: 7572, patents: 2100, citations: 6100 },
  { year: "2022", publications: 8576, patents: 2400, citations: 7200 },
  { year: "2023", publications: 9163, patents: 2700, citations: 8100 },
  { year: "2024", publications: 10428, patents: 3000, citations: 9200 }
];

  const lineChartgrowthdata = [
    { year: '2015', publications: 5.44 },
    { year: '2016', publications: 38.54},
    { year: '2017', publications: 27.18},
    { year: '2018', publications: 40.32},
    { year: '2019', publications: 40.48},
    { year: '2020', publications: 25.31},
    { year: '2021', publications: 28.21},
    { year: '2022', publications: 13.26},
    { year: '2023', publications: 6.84},
    { year: '2024', publications: 13.81}
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

const label = { inputProps: { 'aria-label': 'Switch demo' } };

  const renderLineChartCard = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
        Publications Over period of time (2003-2023)
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
            dataKey="publications"
            stroke="#0088FE"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Publications"
          />
          <Line
            type="monotone"
            dataKey="patents"
            stroke="#00C49F"
            strokeWidth={2}
            name="Top 10 publications"
          />
          <Line
            type="monotone"
            dataKey="citations"
            stroke="#FF8042"
            strokeWidth={2}
            name="Top 1 publications"
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
              dataKey="publications" 
              stroke="#0088FE" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
              name="Publications"
            />
          </LineChart>
          
        </ResponsiveContainer>
      </Box>
      <span>Data : Source :</span>
    </LargeDashboardCard>
  );

const Publications = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#5f6f80', mb: 3 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Left side - Title */}
            <TitleButton 
              onClick={() => navigate('/ctt_dashboard')}
              disableRipple
            >
              Critical Technology Tracker
            </TitleButton>
            
            {/* Right side - Navigation buttons */}
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
      {/* Description Section */}
      <Grid item size={12}>
        <h6>Description</h6>
        <p>
          Unlock valuable insights into user behavior and preferences through our comprehensive user analysis, empowering your decision-making with data-driven strategies.
        </p>
      </Grid>

      {/* Temporal Trends Section */}
      <Grid item size={12}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <h6>Temporal Trends in Research Publications</h6>
            <p>See how knowledge creation has accelerated over time.</p>
          </Grid>
          <Grid item size={6}>
            <Switch {...label} /> %
          </Grid>
         </Grid>
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

      <Grid item size={12}>
        <Grid container spacing={2}>
          <Grid item size={6}>
            <h6>Research That Resonates: Top 10% Publications</h6>
            <p>Visualize where the world’s most impactful scientific contributions are being produced.</p>
            </Grid>
            <Grid item size={6}>
              <Switch {...label} /> %
            </Grid>
          </Grid>
      </Grid>

      <Grid item size={12}>
          {/* <AppBar position="static" sx={{ mb: 3 }}>
                  <Container maxWidth="xl">
                    <Toolbar disableGutters> */}
                      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
                        <NavButton2 onClick={() => navigate('')}>Countries</NavButton2>
                        <NavButton2 onClick={() => navigate('')}>Institutes</NavButton2>
                      </Box>
                    {/* </Toolbar>
                  </Container>
                </AppBar> */}
      </Grid>

      <Grid item size={12}>
        <Grid container spacing={2}>
          <Grid item size={6}>
              {/* <Publication_Bar /> */}
              <TopTenPublicBar />
          </Grid>
          <Grid item size={6}>
              <TopTenPublications />
          </Grid>
        </Grid>
      </Grid>

    </Grid>

    <Grid item size={12}>
      <GlobalSynergy />
    </Grid>

           
    </>
  );
};

export default Publications;
