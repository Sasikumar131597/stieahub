// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend
// } from "recharts";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField
// } from "@mui/material";

// const MultiLinePublicationGraph = () => {
//   const { sub_tech_id } = useParams();

//   const [activeMetric, setActiveMetric] = useState("total");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [countries, setCountries] = useState([]);
//   const [graphData, setGraphData] = useState([]);
//   const [search, setSearch] = useState("");

//   /* Expanded color palette */
//   const colorPalette = [
//     "#1E88E5", "#D81B60", "#43A047", "#FB8C00",
//     "#8E24AA", "#00897B", "#F4511E", "#3949AB",
//     "#6D4C41", "#00ACC1", "#7CB342", "#C62828",
//     "#5E35B1", "#039BE5", "#FDD835", "#546E7A"
//   ];

//   /* ---------------- FETCH DATA ---------------- */
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `https://development.stieahub.in/Codigniter_api/public/get_global_publication_country_rank_multiline/${sub_tech_id}`
//         );
//         const json = await res.json();

//         const uniqueCountries = [...new Set(json.map(d => d.country_name))];
//         setCountries(uniqueCountries);

//         const yearMap = {};
//         json.forEach(row => {
//           const year = Number(row.year);
//           if (!yearMap[year]) yearMap[year] = { year };

//           yearMap[year][row.country_name] = {
//             total: Number(row.total_publication_count),
//             top10: Number(row.top_10_publication_count),
//             top1: Number(row.top_1_publication_count)
//           };
//         });

//         setGraphData(Object.values(yearMap).sort((a, b) => a.year - b.year));
//       } catch {
//         setError("Failed to load chart data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [sub_tech_id]);

//   const metric =
//     activeMetric === "total"
//       ? "total"
//       : activeMetric === "top10"
//       ? "top10"
//       : "top1";

//   const displayedCountries = countries.filter(c =>
//     c.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading)
//     return (
//       <Box sx={{ textAlign: "center", p: 3 }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Box sx={{ width: "100%", p: 2 }}>

//       {/* FILTER ROW */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 1.5,
//           mb: 3,
//           flexWrap: "nowrap",
//           overflowX: "auto"
//         }}
//       >
//         <Button
//           size="small"
//           variant={activeMetric === "total" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("total")}
//         >
//           Total Publication
//         </Button>

//         <Button
//           size="small"
//           variant={activeMetric === "top10" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("top10")}
//         >
//           Top 10% Publication
//         </Button>

//         <Button
//           size="small"
//           variant={activeMetric === "top1" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("top1")}
//         >
//           Top 1% Publication
//         </Button>

//         <Button
//           variant={activeMetric === "patentgranted" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("patentgranted")}
//         >
//           Patent Granted
//         </Button>

//         <Button
//           variant={activeMetric === "patentapplication" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("patentapplication")}
//         >
//           Patent Application
//         </Button>

//         <TextField
//           size="small"
//           placeholder="Search country"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           sx={{ minWidth: 240, ml: "auto" }}
//         />
//       </Box>

//       {/* CHART */}
//       <ResponsiveContainer width="100%" height={440}>
//         <LineChart
//           data={graphData}
//           margin={{ top: 20, right: 160, left: 20, bottom: 10 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="year" />
//           <YAxis />
//           <Tooltip />
//           <Legend
//             layout="vertical"
//             align="right"
//             verticalAlign="middle"
//             wrapperStyle={{ paddingLeft: 20 }}
//           />

//           {displayedCountries.map((country, index) => (
//             <Line
//               key={country}
//               type="monotone"
//               dataKey={(row) => row[country]?.[metric]}
//               name={country}
//               stroke={colorPalette[index % colorPalette.length]}
//               strokeWidth={2}
//               dot={false}
//               activeDot={{ r: 4 }}
//             />
//           ))}
//         </LineChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// export default MultiLinePublicationGraph;

// 2nd

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend
// } from "recharts";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField
// } from "@mui/material";

// const MultiLinePublicationGraph = () => {
//   const { sub_tech_id } = useParams();

//   const [activeMetric, setActiveMetric] = useState("total");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [countries, setCountries] = useState([]);
//   const [graphData, setGraphData] = useState([]);
//   const [search, setSearch] = useState("");

//   const colorPalette = [
//     "#1E88E5", "#D81B60", "#43A047", "#FB8C00",
//     "#8E24AA", "#00897B", "#F4511E", "#3949AB",
//     "#6D4C41", "#00ACC1", "#7CB342", "#C62828"
//   ];

//   /* ---------------- FETCH DATA ---------------- */
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const isPatent =
//           activeMetric === "patentgranted" ||
//           activeMetric === "patentapplication";

//         const url = isPatent
//           ? `https://development.stieahub.in/Codigniter_api/public/get_global_patent_country_rank_multiline/${sub_tech_id}`
//           : `https://development.stieahub.in/Codigniter_api/public/get_global_publication_country_rank_multiline/${sub_tech_id}`;

//         const res = await fetch(url);
//         const json = await res.json();

//         const uniqueCountries = [...new Set(json.map(d => d.country_name))];
//         setCountries(uniqueCountries);

//         const yearMap = {};
//         json.forEach(row => {
//           const year = Number(row.year);
//           if (!yearMap[year]) yearMap[year] = { year };

//           yearMap[year][row.country_name] = isPatent
//             ? {
//                 patentgranted: Number(row.granted_patent_count),
//                 patentapplication: Number(row.patent_application_count)
//               }
//             : {
//                 total: Number(row.total_publication_count),
//                 top10: Number(row.top_10_publication_count),
//                 top1: Number(row.top_1_publication_count)
//               };
//         });

//         setGraphData(Object.values(yearMap).sort((a, b) => a.year - b.year));
//       } catch {
//         setError("Failed to load chart data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [sub_tech_id, activeMetric]);

//   const displayedCountries = countries.filter(c =>
//     c.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading)
//     return (
//       <Box sx={{ textAlign: "center", p: 3 }}>
//         <CircularProgress />
//       </Box>
//     );

//   if (error) return <Alert severity="error">{error}</Alert>;

//   return (
//     <Box sx={{ width: "100%", p: 2 }}>
//       {/* FILTER ROW */}
//       <Box
//         sx={{
//           display: "flex",
//           gap: 1.5,
//           mb: 3,
//           flexWrap: "nowrap",
//           overflowX: "auto"
//         }}
//       >
//         <Button
//           size="small"
//           variant={activeMetric === "total" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("total")}
//         >
//           Total Publication
//         </Button>

//         <Button
//           size="small"
//           variant={activeMetric === "top10" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("top10")}
//         >
//           Top 10% Publication
//         </Button>

//         <Button
//           size="small"
//           variant={activeMetric === "top1" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("top1")}
//         >
//           Top 1% Publication
//         </Button>

//         <Button
//           size="small"
//           variant={activeMetric === "patentgranted" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("patentgranted")}
//         >
//           Patent Granted
//         </Button>

//         <Button
//           size="small"
//           variant={activeMetric === "patentapplication" ? "contained" : "outlined"}
//           onClick={() => setActiveMetric("patentapplication")}
//         >
//           Patent Application
//         </Button>

//         <TextField
//           size="small"
//           placeholder="Search country"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           sx={{ minWidth: 220, ml: "auto" }}
//         />
//       </Box>

//       {/* CHART */}
//       <ResponsiveContainer width="100%" height={440}>
//         <LineChart
//           data={graphData}
//           margin={{ top: 20, right: 160, left: 20, bottom: 10 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="year" />
//           <YAxis />
//           <Tooltip />
//           <Legend layout="vertical" align="right" verticalAlign="middle" />

//           {displayedCountries.map((country, index) => (
//             <Line
//               key={country}
//               type="monotone"
//               dataKey={(row) => row[country]?.[activeMetric]}
//               name={country}
//               stroke={colorPalette[index % colorPalette.length]}
//               strokeWidth={2}
//               dot={false}
//             />
//           ))}
//         </LineChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// export default MultiLinePublicationGraph;

import React, { useEffect, useState } from "react";
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
  TextField
} from "@mui/material";

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
    "#6D4C41", "#00ACC1", "#7CB342", "#C62828"
  ];

  /* ---------------- FETCH DATA ---------------- */
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

        /* Countries (same behavior as publications) */
        const uniqueCountries = [...new Set(json.map(d => d.country_name))];
        setCountries(uniqueCountries);

        /* Year-wise data */
        const yearMap = {};
        json.forEach(row => {
          const year = Number(row.year);
          const country = row.country_name;

          if (!yearMap[year]) yearMap[year] = { year };

          yearMap[year][country] = isPatent
            ? {
                patentgranted: Number(row.granted_patent_count),
                patentapplication: Number(row.patent_application_count)
              }
            : {
                total: Number(row.total_publication_count),
                top10: Number(row.top_10_publication_count),
                top1: Number(row.top_1_publication_count)
              };
        });

        setGraphData(
          Object.values(yearMap).sort((a, b) => a.year - b.year)
        );
      } catch {
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sub_tech_id, activeMetric]);

  const displayedCountries = countries.filter(c =>
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
          Patent Application
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
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />

          {displayedCountries.map((country, index) => (
            <Line
              key={country}
              type="monotone"
              dataKey={(row) => row[country]?.[activeMetric]}
              name={country}
              stroke={colorPalette[index % colorPalette.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MultiLinePublicationGraph;

