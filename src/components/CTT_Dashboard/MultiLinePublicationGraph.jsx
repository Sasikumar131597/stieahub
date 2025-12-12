import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { Box, Typography, Button, CircularProgress, Alert, TextField } from "@mui/material";

const MultiLinePublicationGraph = () => {
  const { sub_tech_id } = useParams();

  const [activeMetric, setActiveMetric] = useState("total");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [countries, setCountries] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [search, setSearch] = useState("");

  const colorPalette = [
    "#1E88E5", "#FBC02D", "#43A047", "#E53935",
    "#8E24AA", "#00ACC1", "#7CB342", "#FF7043"
  ];

  // ----------------------------------------
  // FETCH DATA
  // ----------------------------------------
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://development.stieahub.in/Codigniter_api/public/get_global_publication_country_rank_multiline/${sub_tech_id}`
        );
        const json = await res.json();

        // Unique Countries
        const uniqueCountries = [...new Set(json.map((d) => d.country_name))];
        setCountries(uniqueCountries);

        // Group data by year
        const yearMap = {};
        json.forEach((row) => {
          const year = Number(row.year);

          if (!yearMap[year]) yearMap[year] = { year };

          yearMap[year][row.country_name] = {
            total: Number(row.total_publication_count),
            top10: Number(row.top_10_publication_count),
            top1: Number(row.top_1_publication_count)
          };
        });

        setGraphData(Object.values(yearMap).sort((a, b) => a.year - b.year));
      } catch (err) {
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sub_tech_id]);

  // Metric selection
  const metric =
    activeMetric === "total"
      ? "total"
      : activeMetric === "top10"
      ? "top10"
      : "top1";

  // Search filter
  const displayedCountries = countries.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
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

      {/* Buttons + Search Box in Same Row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <Button
          variant={activeMetric === "total" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("total")}
        >
          Total Publications
        </Button>

        <Button
          variant={activeMetric === "top10" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("top10")}
        >
          Top 10% Publication
        </Button>

        <Button
          variant={activeMetric === "top1" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("top1")}
        >
          Top 1% Publication
        </Button>

        <Button
          variant={activeMetric === "patentgranted" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("patentgranted")}
        >
          Patent Granted
        </Button>

        <Button
          variant={activeMetric === "patentapplication" ? "contained" : "outlined"}
          onClick={() => setActiveMetric("patentapplication")}
        >
          Patent Application
        </Button>

        {/* Search Box */}
        <TextField
          placeholder="Search Country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
        />
      </Box>

      {/* <Typography variant="h6" fontWeight={700} gutterBottom>
        Country Publication Trend ({activeMetric})
      </Typography> */}

      {/* Multi-line chart */}
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={graphData} margin={{ top: 20, right: 120, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tickFormatter={(y) => y.toString()} />
          <YAxis />
          <Tooltip />

          {displayedCountries.map((country, index) => (
            <Line
              key={country}
              type="monotone"
              dataKey={(row) => row[country]?.[metric]}
              name={country}
              stroke={colorPalette[index % colorPalette.length]}
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

    </Box>
  );
};

export default MultiLinePublicationGraph;



