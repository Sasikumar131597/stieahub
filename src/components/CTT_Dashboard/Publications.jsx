import React from "react";
import { useNavigate } from "react-router-dom";
import { 
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

import GlobalSynergy from "./GlobalSynergy";
import Switch from '@mui/material/Switch';
import TopTenPublications from "./TopTenPublications";
import TopTenPublicBar from "./TopTenPublicBar";
import CTTHeader from "./CTT_Header";

// -------------------------------------------------------
// STYLES
// -------------------------------------------------------
const NavButton2 = styled('button')({
  background: 'none',
  border: 'none',
  margin: '0 10px',
  fontSize: '16px',
  cursor: 'pointer'
});

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

// -------------------------------------------------------
// TOOLTIPS & DATA
// -------------------------------------------------------
const LineChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ 
        backgroundColor: 'white', 
        padding: '8px', 
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: 1,
      }}>
        <Typography variant="body2">{`Year: ${payload[0].payload.year}`}</Typography>
        {payload.map((item, index) => (
          <Typography key={index} variant="body2" color={item.color}>
            {`${item.name}: ${item.value}`}
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

const lineChartGrowthData = [
  { year: '2015', publications: 5.44 },
  { year: '2016', publications: 38.54 },
  { year: '2017', publications: 27.18 },
  { year: '2018', publications: 40.32 },
  { year: '2019', publications: 40.48 },
  { year: '2020', publications: 25.31 },
  { year: '2021', publications: 28.21 },
  { year: '2022', publications: 13.26 },
  { year: '2023', publications: 6.84 },
  { year: '2024', publications: 13.81 }
];

// -------------------------------------------------------
// CHART CARDS
// -------------------------------------------------------
const renderLineChartCard = () => (
  <LargeDashboardCard>
    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
      Publications Over Period (2003–2023)
    </Typography>

    <Typography variant="body2">
      Research papers & patent applications for UAV technology (2015–2024).
    </Typography>

    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip content={<LineChartTooltip />} />
          <Legend />

          <Line type="monotone" dataKey="publications" stroke="#0088FE" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="patents" stroke="#00C49F" strokeWidth={2} />
          <Line type="monotone" dataKey="citations" stroke="#FF8042" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>

    <span>Data Source: —</span>
  </LargeDashboardCard>
);

const renderLineChartGrowth = () => (
  <LargeDashboardCard>
    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
      Publications Growth Rate (2015–2024)
    </Typography>

    <Typography variant="body2">
      Growth of research publications across the decade.
    </Typography>

    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineChartGrowthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip content={<LineChartTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="publications" stroke="#0088FE" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>

    <span>Data Source: —</span>
  </LargeDashboardCard>
);

// -------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------
const Publications = () => {
  const navigate = useNavigate();

  return (
    <>
      <CTTHeader />

      <Grid container spacing={2} style={{ padding: "15px" }}>

        <Grid item size={12}>
          <h6>Description</h6>
          <p>
            Unlock insights into research behaviour and global technology evolution.
          </p>
        </Grid>

        <Grid item size={12}>
          <Grid container spacing={2}>
            <Grid item size={6}>
              <h6>Temporal Trends in Research Publications</h6>
              <p>See how knowledge creation has accelerated.</p>
            </Grid>
            <Grid item size={6}>
              <Switch {...label} /> %
            </Grid>
          </Grid>
        </Grid>

        <Grid item size={12}>
          <Grid container spacing={2}>
            <Grid item size={6}>{renderLineChartCard()}</Grid>
            <Grid item size={6}>{renderLineChartGrowth()}</Grid>
          </Grid>
        </Grid>

        {/* TOP 10 SECTION */}
        <Grid item size={12}>
          <Grid container spacing={2}>
            <Grid item size={6}>
              <h6>Research That Resonates: Top 10% Publications</h6>
              <p>See where the world’s most impactful research comes from.</p>
            </Grid>
            <Grid item size={6}>
              <Switch {...label} /> %
            </Grid>
          </Grid>
        </Grid>

        {/* COUNTRY / INSTITUTE BUTTONS */}
        <Grid item size={12}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <NavButton2>Countries</NavButton2>
            <NavButton2>Institutes</NavButton2>
          </Box>
        </Grid>

        <Grid item size={12}>
          <Grid container spacing={2}>
            <Grid item size={6}><TopTenPublicBar /></Grid>
            <Grid item size={6}><TopTenPublications /></Grid>
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

