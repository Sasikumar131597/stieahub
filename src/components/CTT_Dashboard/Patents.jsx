// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   AppBar, 
//   Toolbar, 
//   Button, 
//   Container, 
//   Box,
//   Typography,
//   Card
// } from '@mui/material';
// import Grid from '@mui/material/Grid2';
// import { styled } from '@mui/material/styles';
// import { 
//   ResponsiveContainer, 
//   Tooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend
// } from 'recharts';
// import InternationalPatents from "./InternationalPatents";

// // Styled NavButton
// const NavButton = styled(Button)(({ theme }) => ({
//   color: 'white',
//   margin: theme.spacing(0, 1),
//   '&.active': {
//     fontWeight: 'bold',
//     borderBottom: '2px solid white'
//   },
//   '&:hover': {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)'
//   }
// }));

// // Styled TitleButton
// const TitleButton = styled(Button)(({ theme }) => ({
//   color: 'white',
//   fontWeight: 'bold',
//   fontSize: '1.1rem',
//   textTransform: 'none',
//   '&:hover': {
//     backgroundColor: 'transparent'
//   }
// }));


//   const LineChartTooltip = ({ active, payload }) => {
//   if (active && payload && payload?.length) {
//     return (
//       <Box sx={{ 
//         backgroundColor: 'white', 
//         padding: '8px', 
//         border: '1px solid #ccc',
//         borderRadius: '4px',
//         boxShadow: 1,
//       }}>
//         <Typography variant="body2">{`Year: ${payload[0]?.payload?.year}`}</Typography>
//         {payload?.map((item, index) => (
//           <Typography key={index} variant="body2" color={item?.color}>
//             {`${item?.name}: ${item?.value}`}
//           </Typography>
//         ))}
//       </Box>
//     );
//   }
//   return null;
// };

// const lineChartData = [
//     { year: '2015', Patents: 1357},
//     { year: '2016', Patents: 1880},
//     { year: '2017', Patents: 2391},
//     { year: '2018', Patents: 3355},
//     { year: '2019', Patents: 4713},
//     { year: '2020', Patents: 5906},
//     { year: '2021', Patents: 7572},
//     { year: '2022', Patents: 8576},
//     { year: '2023', Patents: 9163},
//     { year: '2024', Patents: 10428}
//   ];

//   const lineChartgrowthdata = [
//     { year: '2015', Patents: 5.44 },
//     { year: '2016', Patents: 38.54},
//     { year: '2017', Patents: 27.18},
//     { year: '2018', Patents: 40.32},
//     { year: '2019', Patents: 40.48},
//     { year: '2020', Patents: 25.31},
//     { year: '2021', Patents: 28.21},
//     { year: '2022', Patents: 13.26},
//     { year: '2023', Patents: 6.84},
//     { year: '2024', Patents: 13.81}
//   ];

//   const LargeDashboardCard = styled(Card)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   height: '400px',
//   padding: theme.spacing(2),
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[2],
//   transition: 'box-shadow 0.3s ease',
//   '&:hover': {
//     boxShadow: theme.shadows[4]
//   }
// }));

//   const renderLineChartCard = () => (
//     <LargeDashboardCard>
//       <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
//         Publications and Patents Trend (2015-2024)
//       </Typography>
//       <Typography variant="p">
//         Here we look at research papers published and patent applications for UAV technology between years 2015 and 2024.
//       </Typography>
//       <Box sx={{ flexGrow: 1 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={lineChartData}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="year" />
//             <YAxis />
//             <Tooltip content={<LineChartTooltip />} />
//             <Legend />
//             <Line 
//               type="monotone" 
//               dataKey="Patents" 
//               stroke="#FF8042" 
//               activeDot={{ r: 8 }} 
//               strokeWidth={2}
//               name="Patents"
//             />
//           </LineChart>
          
//         </ResponsiveContainer>
//       </Box>
//       <span>Data : Source :</span>
//     </LargeDashboardCard>
//   );

//   const renderLineChartgrowth = () => (
//     <LargeDashboardCard>
//       <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
//         Publications growth rate (2015-2024)
//       </Typography>
//       <Typography variant="p">
//         Here we look at research papers published and patent applications for UAV technology between years 2015 and 2024.
//       </Typography>
//       <Box sx={{ flexGrow: 1 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             data={lineChartgrowthdata}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="year" />
//             <YAxis />
//             <Tooltip content={<LineChartTooltip />} />
//             <Legend />
//             <Line 
//               type="monotone" 
//               dataKey="Patents" 
//               stroke="#FF8042" 
//               activeDot={{ r: 8 }} 
//               strokeWidth={2}
//               name="Patents"
//             />
//           </LineChart>
          
//         </ResponsiveContainer>
//       </Box>
//       <span>Data : Source :</span>
//     </LargeDashboardCard>
//   );

// const Patents = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <AppBar position="static" sx={{ backgroundColor: '#5f6f80', mb: 3 }}>
//         <Container maxWidth="xl">
//           <Toolbar disableGutters>
//             <TitleButton 
//               onClick={() => navigate('/ctt_dashboard')}
//               disableRipple
//             >
//               Critical Technology Tracker
//             </TitleButton>
            
//           </Toolbar>
//         </Container>
//       </AppBar>

//      <Grid container spacing={2} style={{padding:"15px"}}>
//       <Grid item size={12}>
//         <h6>Description</h6>
//         <p>
//           Unlock valuable insights into user behavior and preferences through our comprehensive user analysis, empowering your decision-making with data-driven strategies.
//         </p>
//       </Grid>

//       <Grid item size={12}>
//         <h6>Temporal Trends in Research Publications</h6>
//         <p>See how knowledge creation has accelerated over time.</p>
//       </Grid>

//       <Grid item size={12}>
//         <Grid container spacing={2}>
//           <Grid item size={6}>
//             {renderLineChartCard()}
//           </Grid>
//           <Grid item size={6} >
//             {renderLineChartgrowth()}
//           </Grid>
//         </Grid>
//       </Grid>

//       <Grid item size={12}>
//         <InternationalPatents />
//         {/* <WorldMap /> */}
//       </Grid>

//     </Grid>

           
//     </>
//   );
// };

// export default Patents;


// 2nd

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  Typography,
  Card,
  CircularProgress,
  TextField
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import {
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";
import InternationalPatents from "./InternationalPatents";

/* ---------------- STYLES ---------------- */
const TitleButton = styled(Button)(({ theme }) => ({
  color: "white",
  fontWeight: "bold",
  fontSize: "1.1rem",
  textTransform: "none"
}));

const LargeDashboardCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "400px",
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2]
}));

/* ---------------- TOOLTIP ---------------- */
const LineChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <Box sx={{ background: "#fff", p: 1, border: "1px solid #ccc" }}>
      <Typography fontWeight="bold">Year: {label}</Typography>
      {payload
        .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
        .map((item, idx) => (
          <Typography key={idx} color={item.color} fontSize={13}>
            {idx + 1}. {item.name}: {item.value ?? 0}%
          </Typography>
        ))}
    </Box>
  );
};

/* ---------------- COLORS ---------------- */
const colorPalette = [
  "#1E88E5", "#D81B60", "#43A047", "#FB8C00",
  "#8E24AA", "#00897B", "#F4511E", "#3949AB",
  "#6D4C41", "#00ACC1"
];

/* ---------------- STATIC VOLUME DATA ---------------- */
const lineChartData = [
  { year: "2015", Patents: 1357 },
  { year: "2016", Patents: 1880 },
  { year: "2017", Patents: 2391 },
  { year: "2018", Patents: 3355 },
  { year: "2019", Patents: 4713 },
  { year: "2020", Patents: 5906 },
  { year: "2021", Patents: 7572 },
  { year: "2022", Patents: 8576 },
  { year: "2023", Patents: 9163 },
  { year: "2024", Patents: 10428 }
];

const Patents = () => {
  const navigate = useNavigate();
  const { sub_tech_id } = useParams();

  const [growthData, setGrowthData] = useState([]);
  const [rankedCountries, setRankedCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH + RANK ---------------- */
  useEffect(() => {
    const fetchGrowthRate = async () => {
      try {
        const res = await fetch(
          `https://development.stieahub.in/Codigniter_api/public/get_patent_growth_rate/${sub_tech_id}`
        );
        const json = await res.json();

        const yearMap = {};
        const latestGrowthByCountry = {};

        json.forEach(row => {
          const year = row.year;
          const country = row.country_name;
          const growth = Number(row.total_growth_rate);

          if (!yearMap[year]) yearMap[year] = { year };
          yearMap[year][country] =
            isNaN(growth) ? null : growth;

          // Track latest growth for ranking
          if (!isNaN(growth)) {
            latestGrowthByCountry[country] = growth;
          }
        });

        // Rank countries by latest growth (DESC)
        const sortedCountries = Object.entries(latestGrowthByCountry)
          .sort((a, b) => b[1] - a[1])
          .map(([country]) => country);

        setGrowthData(
          Object.values(yearMap).sort((a, b) => a.year - b.year)
        );
        setRankedCountries(sortedCountries);
      } catch (err) {
        console.error("Growth API error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrowthRate();
  }, [sub_tech_id]);

  /* ---------------- COUNTRY FILTER ---------------- */
  const displayedCountries = useMemo(
    () =>
      rankedCountries.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
      ),
    [rankedCountries, search]
  );

  /* ---------------- RENDER CARDS ---------------- */
  const renderVolumeChart = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" color="primary">
        Publications and Patents Trend (2015–2024)
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Patents"
              stroke="#FF8042"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </LargeDashboardCard>
  );

  const renderGrowthChart = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" color="primary">
        Patent Growth Rate by Country
      </Typography>

      {/* 🔍 COUNTRY SEARCH */}
      <TextField
        size="small"
        placeholder="Search country"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1 }}
      />

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis unit="%" />
              <Tooltip content={<LineChartTooltip />} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />

              {/* 🔥 RANKED + FILTERED LINES */}
              {displayedCountries.map((country, index) => (
                <Line
                  key={country}
                  type="monotone"
                  dataKey={country}
                  name={country}
                  stroke={colorPalette[index % colorPalette.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </LargeDashboardCard>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#5f6f80", mb: 3 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <TitleButton onClick={() => navigate("/ctt_dashboard")}>
              Critical Technology Tracker
            </TitleButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>
            Country-wise year-over-year patent growth trends ranked by latest growth rate.
          </Typography>
        </Grid>

        {/* <Grid size={12}>{renderVolumeChart()}</Grid> */}
        <Grid size={12}>{renderGrowthChart()}</Grid>

        <Grid size={12}>
          <InternationalPatents />
        </Grid>
      </Grid>
    </>
  );
};

export default Patents;




