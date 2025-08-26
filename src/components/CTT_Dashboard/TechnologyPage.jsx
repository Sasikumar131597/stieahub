import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
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
  ResponsiveContainer, 
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { useParams } from "react-router-dom";

import PieGraph from './PieGraph';
// import PopulationChart from './PopulationChart';
import { FaArrowRight } from "react-icons/fa";
import PopulationChart from './PopulationChart';
import CTTHeader from './CTT_Header';
import ComparisonPublications from './ComparisonPublications';
import PatentActivity from './PatentActivity';

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
  height: '600px',
  marginTop : '10px',
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
  const { techid } = useParams(); // e.g. /technology/3 → "3"
  const [technology, setTechnology] = useState(null);

  useEffect(() => {
    fetch("https://development.stieahub.in/Codigniter_api/public/get_technologies")
      .then((res) => res.json())
      .then((data) => {
        // data is an array of technologies
        const tech = data.find((item) => item.id === techid);
        setTechnology(tech || null);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [techid]);

  

  // Data for cards
  const cardData = [
    {
      title: 'Publications',
      count: 56016,
      image: 'https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/Publications.jpeg',
      url: '/ctt_dashboard/Publications'
    },
    {
      title: 'Patent Records',
      count: 204235,
      image: 'https://development.stieahub.in/Codigniter_api/public/assets/images/CTT/Patents.jpeg',
      url: '/ctt_dashboard/Patents'
    },
    {
      title: 'Publications/Patent Records Ratio',
      count: 42,
      image: 'https://development.stieahub.in/Codigniter_api/public/assets/images/Industry_imgs/3.png'
    }
  ];

  // Pie chart data
  const pieData = [
    { name: 'Publications', value: 21.5, color: '#0088FE' },
    { name: 'Patent Records', value: 78.5, color: '#FF8042' }
  ];

  // Countries & Regions
  const countries = ['Global','United States', 'China', 'United Kingdom', 'Australia'];
  

  const handleGlobalCountryChange = (event) => {
    setGlobalCountry(event.target.value);
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
        <div
        style={{ display: 'flex', justifyContent: 'right', cursor: 'pointer', marginTop: '10px' }}
        onClick={() => navigate(data.url)}
        title={`Expand ${data.title}`}
      >
        <FaArrowRight />
      </div>
    </DashboardCard>
  );

  const renderRatioCard = () => (
    <DashboardCard>
      <RatioCardContent>
        <LeftContent>
          <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
            Publications/Patent Records Ratio
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
    { year: '2015', publications: 1357, patents: 3257 },
    { year: '2016', publications: 1880, patents: 7676 },
    { year: '2017', publications: 2391, patents: 13259 },
    { year: '2018', publications: 3355, patents: 20124 },
    { year: '2019', publications: 4713, patents: 21028 },
    { year: '2020', publications: 5906, patents: 24647 },
    { year: '2021', publications: 7572, patents: 29239 },
    { year: '2022', publications: 8576, patents: 27926 },
    { year: '2023', publications: 9163, patents: 26295 },
    { year: '2024', publications: 10428, patents: 30784 }
  ];

    const renderLineChartCard = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Publications and Patents Trend (2015-2024)
      </Typography>
      <Typography variant="p" style={{marginBottom:"20px"}}>
        Between 2015 and 2024, there has been a consistent rise in research publications on UAV technology, indicating strong academic and institutional interest. Patent filings have also grown steadily, reflecting a sync between research output and commercialization. This trend suggests that while innovation is accelerating, translation into market-ready technologies is also maturing.
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
      <span>Data : Source :</span>
    </LargeDashboardCard>
  );

  return (
    <div>
      <CTTHeader />
      {/* Stats Grid Section */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <HeaderRow>
          <Typography variant="h4" fontWeight="bold">
            {technology?.technology_name}
          </Typography>
          <DropdownContainer>
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel>GLOBAL</InputLabel>
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

            <Button 
              variant="contained" 
              color="primary" 
            >
              {"India"}
            </Button>

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
        <Grid container spacing={1} style={{marginTop:"10px"}}>
            <Grid size={12}>
             {renderLineChartCard()}
           </Grid>
        </Grid>

        <PopulationChart />

        <LargeDashboardCard>
        <Grid container spacing={1}>
           <Typography variant="h6" gutterBottom>
                Stacked Comparison of Total and Elite Publications by Country
            </Typography>
            <ComparisonPublications />
        </Grid>
        </LargeDashboardCard>

          <LargeDashboardCard>
            <Grid container spacing={1}>
              <Typography variant="h6" gutterBottom>
                    Stacked Comparison of Total and Elite Publications by Country
                </Typography>
                <PatentActivity />
            </Grid>
        </LargeDashboardCard>


      </Container>
      
    </div>
  );
};

export default TechnologyPage;

