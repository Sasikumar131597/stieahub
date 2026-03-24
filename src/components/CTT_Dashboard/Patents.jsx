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
  TextField,
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
import InternationalPatents from "./InternationalPatents";
import axios from "axios";
import CTTHeader from "./CTT_Header";

/* ---------------- STYLES ---------------- */
const TitleButton = styled(Button)(() => ({
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
  const [subTech, setSubTech] = useState(null);

  useEffect(() => {
      fetch("https://development.stieahub.in/Codigniter_api/public/get_sub_techlogies")
        .then(res => res.json())
        .then(data => {
          let found = null;
          data.forEach(tech => {
            const sub = tech.sub_techs?.find(
              s => String(s.sub_tech_id) === String(sub_tech_id)
            );
            if (sub) found = sub;
          });
          setSubTech(found);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, [sub_tech_id]);

  /* ---------------- PATENT TREND (UPDATED) ---------------- */
  useEffect(() => {
    axios
      .get(
        `https://development.stieahub.in/Codigniter_api/public/get_patent_trendline_country/${sub_tech_id}`
      )
      .then((res) => {
        const rawData = res.data;

        // Aggregate by year (no document_type logic)
        const grouped = Object.values(
          rawData.reduce((acc, item) => {
            const year = item.year;

            if (!acc[year]) {
              acc[year] = {
                year,
                granted: 0,
                application: 0
              };
            }

            acc[year].granted += Number(item.Patent_granted) || 0;
            acc[year].application += Number(item.Patents_applied) || 0;

            return acc;
          }, {})
        ).sort((a, b) => a.year - b.year);

        setLineChartData(grouped);
      })
      .catch((err) => {
        console.error("Patent Trend API Error:", err);
      });
  }, [sub_tech_id]);

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
          yearMap[year][country] = isNaN(growth) ? null : growth;

          if (!isNaN(growth)) {
            latestGrowthByCountry[country] = growth;
          }
        });

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

  /* ---------------- VOLUME CHART ---------------- */
  const renderVolumeChart = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" color="primary">
        Patent Trend by Granted Vs Applied
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
              name="Patent Granted "
              stroke="#4CAF50"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="application"
              name="Patents Applied"
              stroke="#0011ff"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </LargeDashboardCard>
  );

  /* ---------------- GROWTH CHART ---------------- */
  const renderGrowthChart = () => (
    <LargeDashboardCard>
      <Typography variant="h6" fontWeight="bold" color="primary">
        Patent Growth Rate by Country
      </Typography>

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
    <div style={{marginTop: "60px"}}>

      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {subTech.sub_tech_name}
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </Box>
      

      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>Year-over-year patent trends.</Typography>
        </Grid>

        <Grid size={12}>{renderVolumeChart()}</Grid>

        <Grid size={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>
            Country-wise year-over-year patent growth trends ranked by latest growth rate.
          </Typography>
        </Grid>

        <Grid size={12}>{renderGrowthChart()}</Grid>

        <Grid size={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>International patent collaboration</Typography>
        </Grid>

        <Grid size={12}>
          <InternationalPatents />
        </Grid>
      </Grid>
      </div>
    </>
  );
};

export default Patents;

