// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Card,
//   Container,
//   Divider
// } from "@mui/material";
// import Grid from "@mui/material/Grid2";
// import { styled } from "@mui/material/styles";
// import {
//   ResponsiveContainer,
//   Tooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend
// } from "recharts";


// import CTTHeader from "./CTT_Header";
// import InternationalPublicationCollaboration from "./InternationalPublicationCollaboration";


// const LargeDashboardCard = styled(Card)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   height: "400px",
//   padding: theme.spacing(2),
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[2]
// }));

// // const label = { inputProps: { "aria-label": "Switch demo" } };

// /* ---------------- TOOLTIP ---------------- */
// const LineChartTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     return (
//       <Box sx={{ backgroundColor: "#fff", p: 1, border: "1px solid #ccc" }}>
//         <Typography variant="body2">
//           Year: {payload[0].payload.year}
//         </Typography>
//         {payload.map((item, i) => (
//           <Typography key={i} variant="body2" color={item.color}>
//             {item.name}: {item.value}
//           </Typography>
//         ))}
//       </Box>
//     );
//   }
//   return null;
// };

// const getYearTicksWithGap = (data, gap = 3) => {
//   if (!data || data.length === 0) return [];
//   const years = data.map(d => Number(d.year));
//   const startYear = years[0];
//   const endYear = years[years.length - 1];

//   const ticks = [];
//   for (let y = startYear; y <= endYear; y += gap) {
//     ticks.push(y);
//   }
//   if (!ticks.includes(endYear)) ticks.push(endYear);
//   return ticks;
// };

// /* ---------------- MAIN COMPONENT ---------------- */
// const Publications = () => {
//   const { sub_tech_id } = useParams();

//   const [subTech, setSubTech] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [trendData, setTrendData] = useState([]);
//   // const [growthData, setGrowthData] = useState([]);

//   /* -------- FETCH SUB-TECHNOLOGY -------- */
//   useEffect(() => {
//     fetch("https://development.stieahub.in/Codigniter_api/public/get_sub_techlogies")
//       .then(res => res.json())
//       .then(data => {
//         let found = null;
//         data.forEach(tech => {
//           const sub = tech.sub_techs?.find(
//             s => String(s.sub_tech_id) === String(sub_tech_id)
//           );
//           if (sub) found = sub;
//         });
//         setSubTech(found);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [sub_tech_id]);

//   /* -------- FETCH TREND DATA -------- */
//   useEffect(() => {
//     fetch(
//       `https://development.stieahub.in/Codigniter_api/public/get_publication_trendline_country/${sub_tech_id}`
//     )
//       .then(res => res.json())
//       .then(data => {
//         setTrendData(
//           data.map(row => ({
//             year: row.year,
//             "Total Publications": Number(row.total_publications),
//             "Top 10% Publications": Number(row.top_10_publication_count),
//             "Top 1% Publications": Number(row.top_1_publication_count)
//           }))
//         );
//         // setGrowthData(calculateGrowthRate(data));
//       });
//   }, [sub_tech_id]);

//   if (loading)
//     return (
//       <Container sx={{ mt: 10 }}>
//         <Typography align="center">Loading...</Typography>
//       </Container>
//     );

//   if (!subTech)
//     return (
//       <Container sx={{ mt: 10 }}>
//         <Typography align="center" color="error">
//           No sub-technology found for ID: {sub_tech_id}
//         </Typography>
//       </Container>
//     );

//   return (
//     <>
//       <CTTHeader />
//     <div style={{marginTop: "55px"}}>

//       {/* TITLE */}
//       <Box sx={{ px: 2, py: 2 }}>
//         <Typography variant="h4" fontWeight="bold">
//           {subTech.sub_tech_name}
//         </Typography>
//         <Divider sx={{ mt: 1 }} />
//       </Box>

//       <Grid container spacing={2} sx={{ p: 2 }}>

//         {/* TREND CHARTS */}
//         <Grid item size={12}>
//           <Grid container spacing={2}>
//             <Grid item size={12}>
//               <LargeDashboardCard>
//                 <Typography fontWeight="bold">Publications Trend</Typography>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={trendData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="year" ticks={getYearTicksWithGap(trendData)} />
//                     <YAxis />
//                     <Tooltip content={<LineChartTooltip />} />
//                     <Legend />
//                     <Line dataKey="Total Publications" stroke="#0088FE" />
//                     <Line dataKey="Top 10% Publications" stroke="#00C49F" />
//                     <Line dataKey="Top 1% Publications" stroke="#FF8042" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </LargeDashboardCard>
//             </Grid>
//           </Grid>
//         </Grid>

//       </Grid>

//       {/* <GlobalSynergy /> */}
//       <InternationalPublicationCollaboration />
//       </div>
//     </>
//   );
// };

// export default Publications;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Container,
  Divider
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

import CTTHeader from "./CTT_Header";
import InternationalPublicationCollaboration from "./InternationalPublicationCollaboration";

const LargeDashboardCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "400px",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2]
}));

/* ---------------- TOOLTIP ---------------- */
const LineChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ backgroundColor: "#fff", p: 1, border: "1px solid #ccc", borderRadius: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          Year: {payload[0].payload.year}
        </Typography>
        {payload.map((item, i) => (
          <Typography key={i} variant="body2" color={item.color} sx={{ mt: 0.5 }}>
            {item.name}: {item.value?.toLocaleString()}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

/* ---------------- YEAR TICKS HELPER ---------------- */
// Returns year ticks as STRINGS to match the data format from API
const getYearTicksWithGap = (data, gap = 3) => {
  if (!data || data.length === 0) return [];
  
  // Parse years as numbers for calculation
  const years = data.map(d => Number(d.year)).filter(y => !isNaN(y));
  if (years.length === 0) return [];
  
  const startYear = Math.min(...years);
  const endYear = Math.max(...years);

  const ticks = [];
  for (let y = startYear; y <= endYear; y += gap) {
    ticks.push(String(y)); // Return as string to match data.year format
  }
  // Ensure end year is included
  if (!ticks.includes(String(endYear))) {
    ticks.push(String(endYear));
  }
  return ticks;
};

/* ---------------- MAIN COMPONENT ---------------- */
const Publications = () => {
  const { sub_tech_id } = useParams();

  const [subTech, setSubTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);

  /* -------- FETCH SUB-TECHNOLOGY -------- */
  useEffect(() => {
    if (!sub_tech_id) {
      setLoading(false);
      return;
    }
    
    fetch("https://development.stieahub.in/Codigniter_api/public/get_sub_techlogies")
      .then(res => res.json())
      .then(data => {
        let found = null;
        if (Array.isArray(data)) {
          data.forEach(tech => {
            const sub = tech.sub_techs?.find(
              s => String(s.sub_tech_id) === String(sub_tech_id)
            );
            if (sub) found = sub;
          });
        }
        setSubTech(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sub-technologies:", err);
        setLoading(false);
      });
  }, [sub_tech_id]);

  /* -------- FETCH TREND DATA -------- */
  useEffect(() => {
    if (!sub_tech_id) return;
    
    fetch(
      `https://development.stieahub.in/Codigniter_api/public/get_publication_trendline_country/${sub_tech_id}`
    )
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTrendData(
            data.map(row => ({
              year: String(row.year), // Ensure year is string for consistent XAxis matching
              "Total Publications": Number(row.total_publications) || 0,
              "Top 10% Publications": Number(row.top_10_publication_count) || 0,
              "Top 1% Publications": Number(row.top_1_publication_count) || 0
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching publication trend:", err);
      });
  }, [sub_tech_id]);

  if (loading)
    return (
      <Container sx={{ mt: 10 }}>
        <Typography align="center">Loading...</Typography>
      </Container>
    );

  if (!subTech)
    return (
      <Container sx={{ mt: 10 }}>
        <Typography align="center" color="error">
          No sub-technology found for ID: {sub_tech_id}
        </Typography>
      </Container>
    );

  return (
    <>
      <CTTHeader />
      <div style={{ marginTop: "55px" }}>

        {/* TITLE */}
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            {subTech.sub_tech_name}
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Box>

        <Grid container spacing={2} sx={{ p: 2 }}>

          {/* TREND CHARTS */}
          <Grid item size={12}>
            <Grid container spacing={2}>
              <Grid item size={12}>
                <LargeDashboardCard>
                  <Typography fontWeight="bold" gutterBottom>
                    Publications Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                      data={trendData}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        ticks={getYearTicksWithGap(trendData, 3)}
                        tick={{ fontSize: 12 }}
                        interval={0}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <Tooltip content={<LineChartTooltip />} />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Total Publications" 
                        stroke="#0088FE" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Top 10% Publications" 
                        stroke="#00C49F" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Top 1% Publications" 
                        stroke="#FF8042" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </LargeDashboardCard>
              </Grid>
            </Grid>
          </Grid>

        </Grid>

        <InternationalPublicationCollaboration />
      </div>
    </>
  );
};

export default Publications;


