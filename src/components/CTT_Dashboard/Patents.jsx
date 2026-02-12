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
import axios from "axios";


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

const Patents = () => {
  const navigate = useNavigate();
  const { sub_tech_id } = useParams();

  const [growthData, setGrowthData] = useState([]);
  const [rankedCountries, setRankedCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [lineChartData, setLineChartData] = useState([]);

  useEffect(() => {
  axios
    .get(
      "https://development.stieahub.in/Codigniter_api/public/get_patent_trendline_country/44"
    )
    .then((res) => {
      const rawData = res.data;

      const transformed = Object.values(
        rawData.reduce((acc, item) => {
          const year = item.year;

          if (!acc[year]) {
            acc[year] = {
              year: year,
              granted: 0,
              application: 0,
            };
          }

          if (item.document_type === "Granted Patent") {
            acc[year].granted = Number(item.patent_count);
          }

          if (item.document_type === "Patent Application") {
            acc[year].application = Number(item.patent_count);
          }

          return acc;
        }, {})
      );

      setLineChartData(transformed);
    });
}, []);

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

  const renderVolumeChart = () => (
  <LargeDashboardCard>
    <Typography variant="h6" fontWeight="bold" color="primary">
      Patent Trend by Document Type
    </Typography>

    <Box sx={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="granted"
            name="Granted Patent"
            stroke="#4CAF50"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="application"
            name="Patent Application"
            stroke="#FF9800"
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

              {/*  RANKED + FILTERED LINES */}
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
            Year-over-year patent trends.
          </Typography>
        </Grid>
        <Grid size={12}>{renderVolumeChart()}</Grid>


        <Grid size={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>
            Country-wise year-over-year patent growth trends ranked by latest growth rate.
          </Typography>
        </Grid>

        {/* <Grid size={12}>{renderVolumeChart()}</Grid> */}
        <Grid size={12}>{renderGrowthChart()}</Grid>

    <Grid size={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>
            International patent collaboration
          </Typography>
        </Grid>
        <Grid size={12}>
          <InternationalPatents />
        </Grid>
      </Grid>
    </>
  );
};

export default Patents;




