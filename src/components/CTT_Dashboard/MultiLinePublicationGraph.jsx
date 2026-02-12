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

/* ---------------- TOOLTIP (DESC RANKING) ---------------- */
const RankedTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const sorted = [...payload].sort(
    (a, b) => (b.value || 0) - (a.value || 0)
  );

  return (
    <Box sx={{ background: "#fff", p: 1.5, border: "1px solid #ccc" }}>
      <Typography fontWeight="bold" fontSize={13}>
        Year: {label}
      </Typography>

      {sorted.map((item, idx) => (
        <Box
          key={item.name}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: item.color,
            fontSize: 13
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

  const [graphData, setGraphData] = useState([]);
  const [rankedCountries, setRankedCountries] = useState([]);
  const [search, setSearch] = useState("");

  const colorPalette = [
    "#1E88E5", "#D81B60", "#43A047", "#FB8C00",
    "#8E24AA", "#00897B", "#F4511E", "#3949AB",
    "#6D4C41", "#00ACC1"
  ];

  /* ---------------- FETCH & PROCESS ---------------- */
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

        /* ---- GROUP BY YEAR ---- */
        const byYear = {};
        json.forEach(row => {
          const year = Number(row.year);
          if (!byYear[year]) byYear[year] = [];

          byYear[year].push({
            country: row.country_name,
            total: +row.total_publication_count,
            top10: +row.top_10_publication_count,
            top1: +row.top_1_publication_count,
            patentgranted: +row.granted_patent_count,
            patentapplication: +row.other_patent_count
          });
        });

        const countryLatestValue = {};
        const yearRows = [];

        Object.entries(byYear).forEach(([year, rows]) => {
          const row = { year: Number(year) };

          rows.forEach(r => {
            row[r.country] = r[activeMetric] || 0;
            countryLatestValue[r.country] =
              (countryLatestValue[r.country] || 0) + (r[activeMetric] || 0);
          });

          yearRows.push(row);
        });


        /* ---- SORT COUNTRIES ONCE ( CORE FIX) ---- */
        const sortedCountries = Object.entries(countryLatestValue)
          .sort((a, b) => b[1] - a[1])
          .map(([country]) => country);

        setGraphData(yearRows.sort((a, b) => a.year - b.year));
        setRankedCountries(sortedCountries);
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
      rankedCountries.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
      ),
    [rankedCountries, search]
  );

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      {/* FILTERS */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
        {[
          ["total", "Total Publication"],
          ["top10", "Top 10% Publication"],
          ["top1", "Top 1% Publication"],
          ["patentgranted", "Patent Granted"],
          ["patentapplication", "Patent Records"]
        ].map(([key, label]) => (
          <Button
            key={key}
            size="small"
            variant={activeMetric === key ? "contained" : "outlined"}
            onClick={() => setActiveMetric(key)}
          >
            {label}
          </Button>
        ))}

        <TextField
          size="small"
          placeholder="Search country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ ml: "auto", minWidth: 220 }}
        />
      </Box>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={440}>
        <LineChart data={graphData} margin={{ top: 20, right: 160 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip content={<RankedTooltip />} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />

          {/* LINES CREATED IN RANK ORDER */}
          {displayedCountries.map((country, index) => (
            <Line
              key={country}
              type="monotone"
              dataKey={country}
              name={`${country}`}
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


