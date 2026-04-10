// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ReferenceLine
// } from "recharts";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Alert,
//   TextField,
//   Typography
// } from "@mui/material";
// import { Autocomplete } from "@mui/material";

// /* ---------------- TOOLTIP (TOP 20 DESC RANKING) ---------------- */
// const RankedTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;

//   const countryMap = {};
//   payload.forEach((item) => {
//     const isAfter = item.dataKey?.endsWith("__after");
//     const countryName = isAfter ? item.dataKey.replace("__after", "") : item.dataKey;
//     if (!countryMap[countryName]) {
//       countryMap[countryName] = { name: countryName, value: item.value, color: item.color };
//     } else if (isAfter) {
//       countryMap[countryName].value = item.value;
//       countryMap[countryName].color = item.color;
//     }
//   });

//   const sorted = Object.values(countryMap)
//     .filter((item) => item.value != null)
//     .sort((a, b) => (b.value || 0) - (a.value || 0))
//     .slice(0, 20);

//   return (
//     <Box
//       sx={{
//         background: "#fff",
//         p: 1.5,
//         border: "1px solid #ccc",
//         minWidth: 220,
//         maxHeight: 420,
//         overflowY: "auto",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//         borderRadius: 1
//       }}
//     >
//       <Typography fontWeight="bold" fontSize={13} mb={0.5}>
//         Year: {label}
//       </Typography>
//       {sorted.map((item, idx) => (
//         <Box
//           key={item.name}
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             color: item.color,
//             fontSize: 10,
//             gap: 2,
//             py: 0.2,
//             fontWeight: 600
//           }}
//         >
//           <span>{idx + 1}. {item.name}</span>
//           <span style={{ fontWeight: 600 }}>{item.value?.toLocaleString()}</span>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// /* ---------------- CUSTOM REFERENCE LINE LABEL ---------------- */
// const ReferenceLineLabel = ({ viewBox }) => {
//   const { x, y } = viewBox;
//   return (
//     <text
//       x={x + 6}
//       y={y + 14}
//       fill="#333"
//       fontSize={11}
//       fontWeight="600"
//       fontStyle="italic"
//     >
      
//     </text>
//   );
// };

// /* ---------------- CUSTOM X-AXIS TICK (clickable only for 2023 & 2024) ---------------- */
// const CLICKABLE_YEARS = [2023, 2024];

// const CustomXAxisTick = ({ x, y, payload, isPatentMetric, highlightedYear, onYearClick }) => {
//   const isClickable = isPatentMetric && CLICKABLE_YEARS.includes(payload.value);
//   const isHighlighted = highlightedYear === payload.value;
//   const isAfter = isPatentMetric && highlightedYear !== null && payload.value > highlightedYear;

//   return (
//     <g
//       transform={`translate(${x},${y})`}
//       onClick={() => isClickable && onYearClick(payload.value)}
//       style={{ cursor: isClickable ? "pointer" : "default" }}
//     >
//       <text
//         x={0} y={0} dy={16}
//         textAnchor="middle"
//         fill={isAfter ? "#ccc" : isHighlighted ? "#1E88E5" : isClickable ? "#333" : "#666"}
//         fontWeight={isHighlighted ? "bold" : isClickable ? "600" : "normal"}
//         fontSize={isHighlighted ? 13 : 12}
//       >
//         {payload.value}
//       </text>
//       {isHighlighted && (
//         <rect x={-18} y={20} width={36} height={2} rx={1} fill="#1E88E5" />
//       )}
//       {isClickable && !isHighlighted && !isAfter && (
//         <rect x={-18} y={20} width={36} height={1} rx={1} fill="#aaa" />
//       )}
//     </g>
//   );
// };

// const DEFAULT_HIGHLIGHT_YEAR = 2023;
// const REFERENCE_YEAR = 2023;

// const MultiLinePublicationGraph = () => {
//   const { sub_tech_id } = useParams();

//   const [activeMetric, setActiveMetric] = useState("total");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [graphData, setGraphData] = useState([]);
//   const [rankedCountries, setRankedCountries] = useState([]);
//   const [selectedCountries, setSelectedCountries] = useState([]);
//   const [selectedYears, setSelectedYears] = useState([]);
//   const [highlightedYear, setHighlightedYear] = useState(null);

//   const colorPalette = [
//     "#1E88E5", "#D81B60", "#43A047", "#FB8C00",
//     "#8E24AA", "#00897B", "#F4511E", "#3949AB",
//     "#6D4C41", "#00ACC1", "#C0CA33", "#039BE5",
//     "#E53935", "#8D6E63", "#546E7A", "#FFB300",
//     "#26A69A", "#7E57C2", "#EF5350", "#66BB6A"
//   ];

//   const isPatentMetric = useMemo(() =>
//     activeMetric === "patentgranted" || activeMetric === "patentapplication",
//     [activeMetric]
//   );

//   useEffect(() => {
//     setHighlightedYear(isPatentMetric ? DEFAULT_HIGHLIGHT_YEAR : null);
//   }, [activeMetric, isPatentMetric]);

//   const yearsList = useMemo(() =>
//     [...new Set(graphData.map((item) => item.year))],
//     [graphData]
//   );

//   const handleYearClick = useCallback((year) => {
//     if (!isPatentMetric || !CLICKABLE_YEARS.includes(year)) return;
//     setHighlightedYear((prev) => (prev === year ? DEFAULT_HIGHLIGHT_YEAR : year));
//   }, [isPatentMetric]);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const isPatent = activeMetric === "patentgranted" || activeMetric === "patentapplication";
//         const url = isPatent
//           ? `https://development.stieahub.in/Codigniter_api/public/get_global_patent_country_rank_multiline/${sub_tech_id}`
//           : `https://development.stieahub.in/Codigniter_api/public/get_global_publication_country_rank_multiline/${sub_tech_id}`;

//         const res = await fetch(url);
//         const json = await res.json();

//         const byYear = {};
//         json.forEach(row => {
//           const year = Number(row.year);
//           if (!byYear[year]) byYear[year] = [];
//           byYear[year].push({
//             country: row.country_name,
//             total: +row.total_publication_count,
//             top10: +row.top_10_publication_count,
//             top1: +row.top_1_publication_count,
//             patentgranted: +row.Patent_granted,
//             patentapplication: +row.Patents_applied
//           });
//         });

//         const countryLatestValue = {};
//         const yearRows = [];
//         Object.entries(byYear).forEach(([year, rows]) => {
//           const row = { year: Number(year) };
//           rows.forEach(r => {
//             row[r.country] = r[activeMetric] || 0;
//             countryLatestValue[r.country] = (countryLatestValue[r.country] || 0) + (r[activeMetric] || 0);
//           });
//           yearRows.push(row);
//         });

//         const sortedCountries = Object.entries(countryLatestValue)
//           .sort((a, b) => b[1] - a[1])
//           .map(([country]) => country);

//         setGraphData(yearRows.sort((a, b) => a.year - b.year));
//         setRankedCountries(sortedCountries);
//       } catch {
//         setError("Failed to load chart data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [sub_tech_id, activeMetric]);

//   const displayedCountries = useMemo(() =>
//     selectedCountries.length === 0 ? rankedCountries : selectedCountries,
//     [selectedCountries, rankedCountries]
//   );

//   const filteredGraphData = useMemo(() =>
//     selectedYears.length === 0 ? graphData : graphData.filter((row) => selectedYears.includes(row.year)),
//     [graphData, selectedYears]
//   );

//   /* Show reference line only when 2023 exists in current data */
//   // const showReferenceLine = useMemo(() =>
//   //   filteredGraphData.some((r) => r.year === REFERENCE_YEAR),
//   //   [filteredGraphData]
//   // );

//   /* Show reference line only when 2023 exists in current data AND metric is patent-related */
//   const showReferenceLine = useMemo(() =>
//     isPatentMetric && filteredGraphData.some((r) => r.year === REFERENCE_YEAR),
//     [isPatentMetric, filteredGraphData]
//   );

//   const { mergedData, hasAfter } = useMemo(() => {
//     if (!isPatentMetric || highlightedYear === null) {
//       return { mergedData: filteredGraphData, hasAfter: false };
//     }

//     const byYear = {};
//     filteredGraphData.forEach((row) => {
//       if (!byYear[row.year]) byYear[row.year] = { year: row.year };

//       if (row.year <= highlightedYear) {
//         Object.keys(row).forEach((k) => {
//           if (k !== "year") byYear[row.year][k] = row[k];
//         });
//       }
//       if (row.year >= highlightedYear) {
//         Object.keys(row).forEach((k) => {
//           if (k !== "year") byYear[row.year][`${k}__after`] = row[k];
//         });
//       }
//     });

//     const merged = Object.values(byYear).sort((a, b) => a.year - b.year);
//     const hasAfterData = filteredGraphData.some((r) => r.year >= highlightedYear);
//     return { mergedData: merged, hasAfter: hasAfterData };
//   }, [isPatentMetric, highlightedYear, filteredGraphData]);

//   if (loading) return <Box p={3}><CircularProgress /></Box>;
//   if (error) return <Alert severity="error">{error}</Alert>;

//   const BTN_METRICS = [
//     ["total",             "Total Publications"],
//     ["top10",             "Top 10% Highly Cited Publications"],
//     ["top1",              "Top 1% Highly Cited Publications"],
//     ["patentgranted",     "Patent Granted"],
//     ["patentapplication", "Patent Applied"],
//   ];

//   return (
//     <Box sx={{ p: 2 }}>

//       {/* ── SINGLE ROW ── */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           gap: 1,
//           mb: 2,
//           flexWrap: "nowrap",
//           width: "100%"
//         }}
//       >
//         {BTN_METRICS.map(([key, label]) => (
//           <Button
//             key={key}
//             size="small"
//             variant={activeMetric === key ? "contained" : "outlined"}
//             onClick={() => setActiveMetric(key)}
//             sx={{
//               whiteSpace: "nowrap",
//               flexShrink: 0,
//               fontSize: "0.72rem",
//               px: 1.2,
//               height: 40,
//               textTransform: "none"
//             }}
//           >
//             {label}
//           </Button>
//         ))}

//         <Autocomplete
//           multiple
//           size="small"
//           options={yearsList}
//           value={selectedYears}
//           onChange={(_, newValue) => setSelectedYears(newValue)}
//           disableCloseOnSelect
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label="Years"
//               sx={{ "& .MuiInputBase-root": { height: 40, flexWrap: "nowrap", overflow: "hidden" } }}
//             />
//           )}
//           sx={{ width: 180, flexShrink: 0 }}
//         />

//         <Autocomplete
//           multiple
//           size="small"
//           options={rankedCountries}
//           value={selectedCountries}
//           onChange={(_, newValue) => setSelectedCountries(newValue)}
//           disableCloseOnSelect={false}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label="Countries"
//               sx={{ "& .MuiInputBase-root": { height: 40, flexWrap: "nowrap", overflow: "hidden" } }}
//             />
//           )}
//           sx={{ flex: 1, minWidth: 0, flexShrink: 1 }}
//         />
//       </Box>

//       {/* CHART */}
//       <ResponsiveContainer width="100%" height={440}>
//         <LineChart data={mergedData} margin={{ top: 20, right: 200 }}>
//           <CartesianGrid strokeDasharray="3 3" />

//           <XAxis
//             dataKey="year"
//             tick={
//               <CustomXAxisTick
//                 isPatentMetric={isPatentMetric}
//                 highlightedYear={highlightedYear}
//                 onYearClick={handleYearClick}
//               />
//             }
//           />

//           <YAxis />

//           <Tooltip content={<RankedTooltip />} />
//           {/* <Tooltip content={<RankedTooltip />} position={{ x: 1000, y: 40 }}   stick to right side for screenshots
//             />  
//           <Legend layout="vertical" align="right" verticalAlign="middle" />  */}

//           <Legend
//             layout="vertical"
//             align="right"
//             verticalAlign="middle"
//             wrapperStyle={{ right: 100, paddingLeft: 5 }}
//             formatter={(value) => value.endsWith("__after") ? null : value}
//           />

//           {/* ── BLACK & WHITE DOTTED VERTICAL LINE AT 2023 ── */}
//           {showReferenceLine && isPatentMetric && (
//             <ReferenceLine
//               x={REFERENCE_YEAR}
//               stroke="#000"
//               strokeWidth={0.6}
//               strokeDasharray="6 4"
//               label={<ReferenceLineLabel />}
//               ifOverflow="extendDomain"
//             />
//           )}


//           {/* ── FULL-COLOR LINES ── */}
//           {displayedCountries.map((country, index) => (
//             <Line
//               key={`main-${country}`}
//               type="monotone"
//               dataKey={country}
//               name={country}
//               stroke={colorPalette[index % colorPalette.length]}
//               strokeWidth={2}
//               dot={false}
//               connectNulls
//             />
//           ))}

//           {/* ── DASHED LINES AFTER highlightedYear (patent only) ── */}
//           {isPatentMetric && hasAfter &&
//             displayedCountries.map((country, index) => (
//               <Line
//                 key={`after-${country}`}
//                 type="monotone"
//                 dataKey={`${country}__after`}
//                 name={`${country}__after`}
//                 legendType="none"
//                 stroke={colorPalette[index % colorPalette.length]}
//                 strokeWidth={1.5}
//                 strokeOpacity={0.35}
//                 strokeDasharray="4 3"
//                 dot={false}
//                 connectNulls
//               />
//             ))
//           }
//         </LineChart>
//       </ResponsiveContainer>
//     </Box>
//   );
// };

// export default MultiLinePublicationGraph;




import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import {
  Box,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Typography
} from "@mui/material";
import { Autocomplete } from "@mui/material";

/* ----------------------------------------------------------------
   COLOR PALETTE — 50 visually distinct colors.
   Hue-separated so even adjacent entries look clearly different.
---------------------------------------------------------------- */
const COLOR_PALETTE = [
  "#1E88E5", "#D81B60", "#43A047", "#FB8C00", "#8E24AA",
  "#00897B", "#F4511E", "#3949AB", "#6D4C41", "#00ACC1",
  "#C0CA33", "#E53935", "#8D6E63", "#546E7A", "#FFB300",
  "#26A69A", "#7E57C2", "#EF5350", "#66BB6A", "#EC407A",
  "#29B6F6", "#9CCC65", "#FFA726", "#AB47BC", "#26C6DA",
  "#D4E157", "#5C6BC0", "#FF7043", "#78909C", "#FFCA28",
  "#42A5F5", "#FF5722", "#0288D1", "#388E3C", "#F57C00",
  "#512DA8", "#00796B", "#E64A19", "#303F9F", "#4E342E",
  "#0097A7", "#AFB42B", "#C62828", "#558B2F", "#1565C0",
  "#AD1457", "#37474F", "#6A1B9A", "#00695C", "#BF360C",
];

/* ----------------------------------------------------------------
   Build a STABLE country → color map from the full ranked list.
   Each country keeps the same color forever, regardless of which
   subset is currently selected or shown.
---------------------------------------------------------------- */
const buildColorMap = (rankedCountries) => {
  const map = {};
  rankedCountries.forEach((country, index) => {
    map[country] = COLOR_PALETTE[index % COLOR_PALETTE.length];
  });
  return map;
};

/* ---------------- TOOLTIP (TOP 20 DESC RANKING) ---------------- */
const RankedTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const countryMap = {};
  payload.forEach((item) => {
    const isAfter = item.dataKey?.endsWith("__after");
    const countryName = isAfter ? item.dataKey.replace("__after", "") : item.dataKey;
    if (!countryMap[countryName]) {
      countryMap[countryName] = { name: countryName, value: item.value, color: item.color };
    } else if (isAfter) {
      countryMap[countryName].value = item.value;
      countryMap[countryName].color = item.color;
    }
  });

  const sorted = Object.values(countryMap)
    .filter((item) => item.value != null)
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 20);

  return (
    <Box
      sx={{
        background: "#fff",
        p: 1.5,
        border: "1px solid #ccc",
        minWidth: 220,
        maxHeight: 420,
        overflowY: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderRadius: 1,
      }}
    >
      <Typography fontWeight="bold" fontSize={13} mb={0.5}>
        Year: {label}
      </Typography>
      {sorted.map((item, idx) => (
        <Box
          key={item.name}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: item.color,
            fontSize: 10,
            gap: 2,
            py: 0.2,
            fontWeight: 600,
          }}
        >
          <span>{idx + 1}. {item.name}</span>
          <span style={{ fontWeight: 600 }}>{item.value?.toLocaleString()}</span>
        </Box>
      ))}
    </Box>
  );
};

/* ---------------- CUSTOM REFERENCE LINE LABEL ---------------- */
const ReferenceLineLabel = ({ viewBox }) => {
  const { x, y } = viewBox;
  return (
    <text x={x + 6} y={y + 14} fill="#333" fontSize={11} fontWeight="600" fontStyle="italic">
      
    </text>
  );
};

/* ---------------- CUSTOM X-AXIS TICK ---------------- */
const CLICKABLE_YEARS = [2023, 2024];

const CustomXAxisTick = ({ x, y, payload, isPatentMetric, highlightedYear, onYearClick }) => {
  const isClickable = isPatentMetric && CLICKABLE_YEARS.includes(payload.value);
  const isHighlighted = highlightedYear === payload.value;
  const isAfter = isPatentMetric && highlightedYear !== null && payload.value > highlightedYear;

  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={() => isClickable && onYearClick(payload.value)}
      style={{ cursor: isClickable ? "pointer" : "default" }}
    >
      <text
        x={0} y={0} dy={16}
        textAnchor="middle"
        fill={isAfter ? "#ccc" : isHighlighted ? "#1E88E5" : isClickable ? "#333" : "#666"}
        fontWeight={isHighlighted ? "bold" : isClickable ? "600" : "normal"}
        fontSize={isHighlighted ? 13 : 12}
      >
        {payload.value}
      </text>
      {isHighlighted && (
        <rect x={-18} y={20} width={36} height={2} rx={1} fill="#1E88E5" />
      )}
      {isClickable && !isHighlighted && !isAfter && (
        <rect x={-18} y={20} width={36} height={1} rx={1} fill="#aaa" />
      )}
    </g>
  );
};

/* ---------------- CUSTOM RANKED LEGEND (right panel) ---------------- */
// const CustomRankedLegend = ({ countries, colorMap, rankedCountries }) => (
//   <Box
//     sx={{
//       display: "flex",
//       flexDirection: "column",
//       gap: 0.35,
//       maxHeight: 440,
//       overflowY: "auto",
//       pl: 1.5,
//       pr: 0.5,
//       minWidth: 155,
//       flexShrink: 0,
//       borderLeft: "1px solid",
//       borderColor: "divider",
//       alignSelf: "stretch",
//       justifyContent: "flex-start",
//       pt: "20px",
//     }}
//   >
//     <Typography
//       fontSize={10}
//       fontWeight={700}
//       color="text.secondary"
//       mb={0.8}
//       sx={{ letterSpacing: 0.3, textTransform: "uppercase" }}
//     >
//       Rank &nbsp;/&nbsp; Country
//     </Typography>
//     {countries.map((country) => {
//       const globalRank = rankedCountries.indexOf(country) + 1;
//       const color = colorMap[country];
//       return (
//         <Box
//           key={country}
//           sx={{ display: "flex", alignItems: "center", gap: 0.8, minHeight: 16 }}
//         >
//           {/* Color swatch — horizontal line matching the chart line style */}
//           <Box
//             sx={{
//               width: 14,
//               height: 2.5,
//               borderRadius: 1,
//               backgroundColor: color,
//               flexShrink: 0,
//             }}
//           />
//           <Typography
//             fontSize={10}
//             fontWeight={600}
//             noWrap
//             title={country}
//             sx={{ color, lineHeight: 1.4 }}
//           >
//             <span style={{ color: "#888", marginRight: 3, fontVariantNumeric: "tabular-nums", fontWeight: 400 }}>
//               {String(globalRank).padStart(2, "\u2007")}.
//             </span>
//             {country}
//           </Typography>
//         </Box>
//       );
//     })}
//   </Box>
// );

/* ---------------- CUSTOM RANKED LEGEND (right panel) ---------------- */
const CustomRankedLegend = ({ countries, colorMap, rankedCountries }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
      maxHeight: 440,
      overflowY: "auto",
      pl: 1.5,
      pr: 0.5,
      minWidth: 175,        // slightly wider to fit larger text
      flexShrink: 0,
      borderLeft: "1px solid",
      borderColor: "divider",
      alignSelf: "stretch",
      justifyContent: "flex-start",
      // pt: "20px",
    }}
  >
    {/* <Typography
      fontSize={12}          // was 10
      fontWeight={700}
      color="text.secondary"
      mb={0.8}
      sx={{ letterSpacing: 0.3, textTransform: "uppercase" }}
    >
      Rank &nbsp;/&nbsp; Country
    </Typography> */}
    {countries.map((country) => {
      const globalRank = rankedCountries.indexOf(country) + 1;
      const color = colorMap[country];
      return (
        <Box
          key={country}
          sx={{ display: "flex", alignItems: "center", gap: 0.8, minHeight: 18 }}
        >
          <Box
            sx={{
              width: 16,             // was 14
              height: 3,             // was 2.5
              borderRadius: 1,
              backgroundColor: color,
              flexShrink: 0,
            }}
          />
          <Typography
            fontSize={12}            // was 10
            fontWeight={600}
            noWrap
            title={country}
            sx={{ color, lineHeight: 1.5 }}
          >
            <span style={{ color: "#888", marginRight: 4, fontVariantNumeric: "tabular-nums", fontWeight: 400 }}>
              {String(globalRank).padStart(2, "\u2007")}.
            </span>
            {country}
          </Typography>
        </Box>
      );
    })}
  </Box>
);
/* ================================================================ */

const DEFAULT_HIGHLIGHT_YEAR = 2023;
const REFERENCE_YEAR = 2023;

const MultiLinePublicationGraph = () => {
  const { sub_tech_id } = useParams();

  const [activeMetric, setActiveMetric] = useState("total");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [graphData, setGraphData] = useState([]);
  const [rankedCountries, setRankedCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [highlightedYear, setHighlightedYear] = useState(null);

  const isPatentMetric = useMemo(
    () => activeMetric === "patentgranted" || activeMetric === "patentapplication",
    [activeMetric]
  );

  useEffect(() => {
    setHighlightedYear(isPatentMetric ? DEFAULT_HIGHLIGHT_YEAR : null);
  }, [activeMetric, isPatentMetric]);

  const yearsList = useMemo(
    () => [...new Set(graphData.map((item) => item.year))],
    [graphData]
  );

  const handleYearClick = useCallback(
    (year) => {
      if (!isPatentMetric || !CLICKABLE_YEARS.includes(year)) return;
      setHighlightedYear((prev) => (prev === year ? DEFAULT_HIGHLIGHT_YEAR : year));
    },
    [isPatentMetric]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const isPatent =
          activeMetric === "patentgranted" || activeMetric === "patentapplication";
        const url = isPatent
          ? `https://development.stieahub.in/Codigniter_api/public/get_global_patent_country_rank_multiline/${sub_tech_id}`
          : `https://development.stieahub.in/Codigniter_api/public/get_global_publication_country_rank_multiline/${sub_tech_id}`;

        const res = await fetch(url);
        const json = await res.json();

        const byYear = {};
        json.forEach((row) => {
          const year = Number(row.year);
          if (!byYear[year]) byYear[year] = [];
          byYear[year].push({
            country: row.country_name,
            total: +row.total_publication_count,
            top10: +row.top_10_publication_count,
            top1: +row.top_1_publication_count,
            patentgranted: +row.Patent_granted,
            patentapplication: +row.Patents_applied,
          });
        });

        const countryLatestValue = {};
        const yearRows = [];
        Object.entries(byYear).forEach(([year, rows]) => {
          const row = { year: Number(year) };
          rows.forEach((r) => {
            row[r.country] = r[activeMetric] || 0;
            countryLatestValue[r.country] =
              (countryLatestValue[r.country] || 0) + (r[activeMetric] || 0);
          });
          yearRows.push(row);
        });

        const sortedCountries = Object.entries(countryLatestValue)
          .sort((a, b) => b[1] - a[1])
          .map(([country]) => country);

        setGraphData(yearRows.sort((a, b) => a.year - b.year));
        setRankedCountries(sortedCountries);
        setSelectedCountries([]); // reset selection on metric change
      } catch {
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sub_tech_id, activeMetric]);

  /* ------------------------------------------------------------------
     STABLE COLOR MAP
     Built once from the full ranked list. Every country always gets
     the same color — regardless of which subset is displayed.
  ------------------------------------------------------------------ */
  const colorMap = useMemo(() => buildColorMap(rankedCountries), [rankedCountries]);

  /* Countries shown in chart & legend */
  const displayedCountries = useMemo(
    () => (selectedCountries.length === 0 ? rankedCountries : selectedCountries),
    [selectedCountries, rankedCountries]
  );

  const filteredGraphData = useMemo(
    () =>
      selectedYears.length === 0
        ? graphData
        : graphData.filter((row) => selectedYears.includes(row.year)),
    [graphData, selectedYears]
  );

  const showReferenceLine = useMemo(
    () => isPatentMetric && filteredGraphData.some((r) => r.year === REFERENCE_YEAR),
    [isPatentMetric, filteredGraphData]
  );

  const { mergedData, hasAfter } = useMemo(() => {
    if (!isPatentMetric || highlightedYear === null) {
      return { mergedData: filteredGraphData, hasAfter: false };
    }

    const byYear = {};
    filteredGraphData.forEach((row) => {
      if (!byYear[row.year]) byYear[row.year] = { year: row.year };

      if (row.year <= highlightedYear) {
        Object.keys(row).forEach((k) => {
          if (k !== "year") byYear[row.year][k] = row[k];
        });
      }
      if (row.year >= highlightedYear) {
        Object.keys(row).forEach((k) => {
          if (k !== "year") byYear[row.year][`${k}__after`] = row[k];
        });
      }
    });

    const merged = Object.values(byYear).sort((a, b) => a.year - b.year);
    const hasAfterData = filteredGraphData.some((r) => r.year >= highlightedYear);
    return { mergedData: merged, hasAfter: hasAfterData };
  }, [isPatentMetric, highlightedYear, filteredGraphData]);

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  const BTN_METRICS = [
    ["total",             "Total Publications"],
    ["top10",             "Top 10% Highly Cited Publications"],
    ["top1",              "Top 1% Highly Cited Publications"],
    ["patentgranted",     "Patent Granted"],
    ["patentapplication", "Patent Applied"],
  ];

  return (
    <Box sx={{ p: 2 }}>

      {/* ── CONTROLS ROW ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          flexWrap: "nowrap",
          width: "100%",
        }}
      >
        {BTN_METRICS.map(([key, label]) => (
          <Button
            key={key}
            size="small"
            variant={activeMetric === key ? "contained" : "outlined"}
            onClick={() => setActiveMetric(key)}
            sx={{
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontSize: "0.72rem",
              px: 1.2,
              height: 40,
              textTransform: "none",
            }}
          >
            {label}
          </Button>
        ))}

        <Autocomplete
          multiple
          size="small"
          options={yearsList}
          value={selectedYears}
          onChange={(_, newValue) => setSelectedYears(newValue)}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField
              {...params}
              label="Years"
              sx={{
                "& .MuiInputBase-root": { height: 40, flexWrap: "nowrap", overflow: "hidden" },
              }}
            />
          )}
          sx={{ width: 180, flexShrink: 0 }}
        />

        <Autocomplete
          multiple
          size="small"
          options={rankedCountries}
          value={selectedCountries}
          onChange={(_, newValue) => setSelectedCountries(newValue)}
          disableCloseOnSelect={false}
          /* Show stable color dot next to each country in the dropdown */
          renderOption={(props, option) => (
            <li {...props} key={option}>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: colorMap[option],
                  mr: 1,
                  flexShrink: 0,
                }}
              />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Countries"
              sx={{
                "& .MuiInputBase-root": { height: 40, flexWrap: "nowrap", overflow: "hidden" },
              }}
            />
          )}
          sx={{ flex: 1, minWidth: 0, flexShrink: 1 }}
        />
      </Box>

      {/* ── CHART + LEGEND ROW ── */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0 }}>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={440}>
            <LineChart
              data={mergedData}
              margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="year"
                tick={
                  <CustomXAxisTick
                    isPatentMetric={isPatentMetric}
                    highlightedYear={highlightedYear}
                    onYearClick={handleYearClick}
                  />
                }
              />

              <YAxis />

              <Tooltip content={<RankedTooltip />} />
              {/* <Tooltip content={<RankedTooltip />} position={{ x: 1000, y: 40 }}   stick to right side for screenshots
//             />  
//           <Legend layout="vertical" align="right" verticalAlign="middle" />  */}

              {/* Reference line at 2023 for patent metrics */}
              {showReferenceLine && (
                <ReferenceLine
                  x={REFERENCE_YEAR}
                  stroke="#000"
                  strokeWidth={0.6}
                  strokeDasharray="6 4"
                  label={<ReferenceLineLabel />}
                  ifOverflow="extendDomain"
                />
              )}

              {/* Solid lines — color always from stable colorMap keyed by country name */}
              {displayedCountries.map((country) => (
                <Line
                  key={`main-${country}`}
                  type="monotone"
                  dataKey={country}
                  name={country}
                  stroke={colorMap[country]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  legendType="none"
                />
              ))}

              {/* Dashed lines after highlightedYear (patent metrics only) */}
              {isPatentMetric &&
                hasAfter &&
                displayedCountries.map((country) => (
                  <Line
                    key={`after-${country}`}
                    type="monotone"
                    dataKey={`${country}__after`}
                    name={`${country}__after`}
                    legendType="none"
                    stroke={colorMap[country]}
                    strokeWidth={1.5}
                    strokeOpacity={0.35}
                    strokeDasharray="4 3"
                    dot={false}
                    connectNulls
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Ranked legend panel */}
        <CustomRankedLegend
          countries={displayedCountries}
          colorMap={colorMap}
          rankedCountries={rankedCountries}
        />

      </Box>
    </Box>
  );
};

export default MultiLinePublicationGraph;
