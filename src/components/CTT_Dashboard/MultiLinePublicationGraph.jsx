import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Typography
} from "@mui/material";

/* ---------------- CUSTOM TOOLTIP (DESC RANKING) ---------------- */
const RankedTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const sorted = [...payload].sort(
    (a, b) => (b.value || 0) - (a.value || 0)
  );

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: 1.5,
        border: "1px solid #ccc",
        borderRadius: 1,
        boxShadow: 2,
        minWidth: 220
      }}
    >
      <Typography variant="body2" fontWeight="bold" gutterBottom>
        Year: {label}
      </Typography>

      {sorted.map((item, idx) => (
        <Box
          key={item.name}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: item.color,
            fontSize: 13,
            mb: 0.3
          }}
        >
          <span>{idx + 1}. {item.name}</span>
          <span>{item.value?.toLocaleString()}</span>
        </Box>
      ))}
    </Box>
  );
};

const MultiLinePublicationGraph = () => {
  const { sub_tech_id } = useParams();

  const [activeMetric, setActiveMetric] = useState("total");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [countries, setCountries] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [search, setSearch] = useState("");

  const colorPalette = [
    "#1E88E5", "#D81B60", "#43A047", "#FB8C00",
    "#8E24AA", "#00897B", "#F4511E", "#3949AB",
    "#6D4C41", "#00ACC1"
  ];

  /* ---------------- FETCH & PROCESS DATA ---------------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const isPatent =
          activeMetric === "patentgranted" ||
          activeMetric === "patentapplication";

        const url = isPatent
          ? `https://development.stieahub.in/Codigniter_api/public/get_global_patent_country_rank_multiline/${sub_tech_id}`
          : `https://development.stieahub.in/Codigniter_api/public/get_global_publication_country_rank_multiline/${sub_tech_id}`;

        const res = await fetch(url);
        const json = await res.json();

        /* -------- GROUP BY YEAR -------- */
        const groupedByYear = {};
        json.forEach(row => {
          const year = Number(row.year);
          if (!groupedByYear[year]) groupedByYear[year] = [];

          groupedByYear[year].push({
            country: row.country_name,
            total: Number(row.total_publication_count),
            top10: Number(row.top_10_publication_count),
            top1: Number(row.top_1_publication_count),
            patentgranted: Number(row.granted_patent_count),
            patentapplication: Number(row.other_patent_count)
          });
        });

        /* -------- RANK PER YEAR & TOP 10 -------- */
        const yearMap = {};
        const countrySet = new Set();

        Object.entries(groupedByYear).forEach(([year, rows]) => {
          const ranked = rows
            .sort((a, b) => (b[activeMetric] || 0) - (a[activeMetric] || 0))
            .slice(0, 10);

          yearMap[year] = { year: Number(year) };

          ranked.forEach(item => {
            yearMap[year][item.country] = item[activeMetric] || 0;
            countrySet.add(item.country);
          });
        });

        setGraphData(
          Object.values(yearMap).sort((a, b) => a.year - b.year)
        );

        setCountries([...countrySet]);
      } catch {
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sub_tech_id, activeMetric]);

  /* ---------------- SEARCH FILTER ---------------- */
  const displayedCountries = useMemo(
    () =>
      countries.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
      ),
    [countries, search]
  );

  if (loading)
    return (
      <Box sx={{ textAlign: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* FILTER ROW */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 3,
          flexWrap: "nowrap",
          overflowX: "auto"
        }}
      >
        {/* PUBLICATIONS */}
        <Button
          size="small"
          variant={activeMetric === "total" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("total")}
        >
          Total Publication
        </Button>

        <Button
          size="small"
          variant={activeMetric === "top10" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("top10")}
        >
          Top 10% Publication
        </Button>

        <Button
          size="small"
          variant={activeMetric === "top1" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("top1")}
        >
          Top 1% Publication
        </Button>

        {/* PATENTS */}
        <Button
          size="small"
          variant={activeMetric === "patentgranted" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("patentgranted")}
        >
          Patent Granted
        </Button>

        <Button
          size="small"
          variant={activeMetric === "patentapplication" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("patentapplication")}
        >
          Patent Records
        </Button>

        <TextField
          size="small"
          placeholder="Search country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 220, ml: "auto" }}
        />
      </Box>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={440}>
        <LineChart
          data={graphData}
          margin={{ top: 20, right: 160, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip content={<RankedTooltip />} />
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
  );
};

export default MultiLinePublicationGraph;


