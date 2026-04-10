// import React, { useEffect, useRef, useState } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5map from "@amcharts/amcharts5/map";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import * as topojson from "topojson-client";
// import { useParams } from "react-router-dom";

// import worldData from "./countries-topo.json";
// import PatentSankey from "./PatentSankey";

// const PublicationCollaboration = () => {
//   const chartRef = useRef(null);
//   const activePolygonRef = useRef(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [apiData, setApiData] = useState([]);
//   const { sub_tech_id } = useParams();

//   /* ---------------- FETCH API ---------------- */
//   useEffect(() => {
//     fetch(
//       `https://development.stieahub.in/Codigniter_api/public/publication_international_collaboration/${sub_tech_id}`
//     )
//       .then((res) => res.json())
//       .then((data) => setApiData(data))
//       .catch((err) => console.error(err));
//   }, [sub_tech_id]);

//   /* ---------------- MAP ---------------- */
//   useEffect(() => {
//     if (!apiData.length) return;

//     const geoObjectName = Object.keys(worldData.objects)[0];
//     const geojson = topojson.feature(
//       worldData,
//       worldData.objects[geoObjectName]
//     );

//     const root = am5.Root.new(chartRef.current);
//     root.setThemes([am5themes_Animated.new(root)]);
//     root._logo.dispose();

//     const chart = root.container.children.push(
//       am5map.MapChart.new(root, {
//         projection: am5map.geoMercator(),
//         panX: "none",
//         panY: "none",
//         wheelX: "none",
//         wheelY: "none",
//       })
//     );

//     /* ---------------- POLYGONS ---------------- */
//     const polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: geojson,
//       })
//     );

//     polygonSeries.mapPolygons.template.setAll({
//       interactive: true,
//       fill: am5.color(0xe3f2fd),
//       stroke: am5.color(0x1e88e5),
//       strokeWidth: 0.8,
//     });

//     polygonSeries.mapPolygons.template.states.create("hover", {
//       fill: am5.color(0x90caf9),
//     });

//     polygonSeries.mapPolygons.template.states.create("active", {
//       fill: am5.color(0x1565c0),
//     });

//     /* ---------------- LINE SERIES ---------------- */
//     const lineSeries = chart.series.push(
//       am5map.MapLineSeries.new(root, {})
//     );

//     lineSeries.mapLines.template.setAll({
//       stroke: am5.color(0xff5722),
//       strokeWidth: 2,
//       strokeOpacity: 0.8,
//     });

//     /* ---------------- NAME FIX ---------------- */
//     const normalizeName = (name) => {
//       const map = {
//         USA: "United States of America",
//         UK: "United Kingdom",
//       };
//       return map[name] || name;
//     };

//     const getPolygon = (name) => {
//       return polygonSeries.mapPolygons.values.find((p) => {
//         const d = p.dataItem?.dataContext;
//         return (
//           d?.name === name ||
//           d?.properties?.name === name ||
//           d?.properties?.ADMIN === name
//         );
//       });
//     };

//     /* ---------------- DRAW LINES ---------------- */
//     polygonSeries.events.on("datavalidated", () => {
//       const parentName = normalizeName(
//         apiData[0].parent_country_name
//       );

//       const parentPolygon = getPolygon(parentName);
//       if (!parentPolygon) {
//         console.log("❌ Parent not found:", parentName);
//         return;
//       }

//       const parentCentroid = parentPolygon.geoCentroid();

//       apiData.forEach((item) => {
//         const targetName = normalizeName(
//           item.collaboration_country_name
//         );

//         const targetPolygon = getPolygon(targetName);
//         if (!targetPolygon) {
//           console.log("❌ Missing:", targetName);
//           return;
//         }

//         const targetCentroid = targetPolygon.geoCentroid();

//         lineSeries.data.push({
//           geometry: {
//             type: "LineString",
//             coordinates: [parentCentroid, targetCentroid],
//           },
//         });
//       });
//     });

//     /* ---------------- CLICK ---------------- */
//     polygonSeries.mapPolygons.template.events.on("click", (ev) => {
//       const country = ev.target.dataItem.dataContext.name;

//       if (activePolygonRef.current) {
//         activePolygonRef.current.states.applyAnimate("default");
//       }

//       ev.target.states.applyAnimate("active");
//       activePolygonRef.current = ev.target;
//       setSelectedCountry(country);
//     });

//     chart.appear(1000, 100);
//     return () => root.dispose();
//   }, [apiData]);

//   return (
//     <div style={{ position: "relative", width: "100%", height: "500px" }}>
//       {/* MAP */}
//       <div
//         ref={chartRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           filter: selectedCountry
//             ? "brightness(0.6) blur(1px)"
//             : "none",
//         }}
//       />

//       {/* SANKEY POPUP */}
//       {selectedCountry && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 460,
//             background: "#fff",
//             borderRadius: 12,
//             boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
//             zIndex: 20,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               padding: "12px 16px",
//               background: "#1565c0",
//               color: "#fff",
//             }}
//           >
//             <strong>{selectedCountry}</strong>
//             <span
//               style={{ cursor: "pointer" }}
//               onClick={() => setSelectedCountry(null)}
//             >
//               ✕
//             </span>
//           </div>

//           <div style={{ padding: 12 }}>
//             <PatentSankey data={[]} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicationCollaboration;


// import React, { useEffect, useRef, useState } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5map from "@amcharts/amcharts5/map";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import * as topojson from "topojson-client";
// import { useParams } from "react-router-dom";

// import worldData from "./countries-topo.json";
// import PatentSankey from "./PatentSankey";

// const PublicationCollaboration = () => {
//   const chartRef = useRef(null);
//   const activePolygonRef = useRef(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [apiData, setApiData] = useState([]);
//   const { sub_tech_id } = useParams();

//   /* ---------------- FETCH API ---------------- */
//   useEffect(() => {
//     fetch(
//       `https://development.stieahub.in/Codigniter_api/public/publication_international_collaboration/${sub_tech_id}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("API:", data);
//         setApiData(data);
//       })
//       .catch((err) => console.error(err));
//   }, [sub_tech_id]);

//   /* ---------------- NAME NORMALIZATION ---------------- */
//   const normalizeToAPI = (name) => {
//     const map = {
//       "United States of America": "USA",
//       "United Kingdom": "UK",
//     };
//     return map[name] || name;
//   };

//   const normalizeFromAPI = (name) => {
//     const map = {
//       USA: "United States of America",
//       UK: "United Kingdom",
//     };
//     return map[name] || name;
//   };

//   /* ---------------- SANKEY DATA ---------------- */
// //   const getSankeyData = (country) => {
// //     if (!apiData.length || !country) return [];

// //     const apiCountry = normalizeToAPI(country);

// //     return apiData
// //       .filter(
// //         (item) =>
// //           item.parent_country_name === apiCountry ||
// //           item.collaboration_country_name === apiCountry
// //       )
// //       .map((item) => ({
// //         from: item.parent_country_name,
// //         to: item.collaboration_country_name,
// //         value: Number(item.collaboration_papers),
// //       }));
// //   };


// const getSankeyData = (country) => {
//   if (!apiData.length || !country) return [];

//   const apiCountry = normalizeToAPI(country);

//   return apiData
//     .filter(
//       (item) =>
//         item.parent_country_name === apiCountry ||
//         item.collaboration_country_name === apiCountry
//     )
//     .map((item) => ({
//       from: item.parent_country_name,
//       to: item.collaboration_country_name,
//       value: Number(item.collaboration_papers),
//       label: `${item.parent_country_name} → ${item.collaboration_country_name} (${item.collaboration_papers})`,
//     }));
// };
//   /* ---------------- MAP ---------------- */
//   useEffect(() => {
//     if (!apiData.length) return;

//     const geoObjectName = Object.keys(worldData.objects)[0];
//     const geojson = topojson.feature(
//       worldData,
//       worldData.objects[geoObjectName]
//     );

//     const root = am5.Root.new(chartRef.current);
//     root.setThemes([am5themes_Animated.new(root)]);
//     root._logo.dispose();

//     const chart = root.container.children.push(
//       am5map.MapChart.new(root, {
//         projection: am5map.geoMercator(),
//         panX: "none",
//         panY: "none",
//         wheelX: "none",
//         wheelY: "none",
//       })
//     );

//     /* ---------------- POLYGONS ---------------- */
//     const polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: geojson,
//       })
//     );

//     polygonSeries.mapPolygons.template.setAll({
//       interactive: true,
//       fill: am5.color(0xe3f2fd),
//       stroke: am5.color(0x1e88e5),
//       strokeWidth: 0.8,
//     });

//     polygonSeries.mapPolygons.template.states.create("hover", {
//       fill: am5.color(0x90caf9),
//     });

//     polygonSeries.mapPolygons.template.states.create("active", {
//       fill: am5.color(0x1565c0),
//     });

//     /* ---------------- LINE SERIES ---------------- */
//     const lineSeries = chart.series.push(
//       am5map.MapLineSeries.new(root, {})
//     );

//     lineSeries.mapLines.template.setAll({
//       stroke: am5.color(0xff5722),
//       strokeWidth: 2,
//       strokeOpacity: 0.8,
//     });

//     /* ---------------- GET POLYGON ---------------- */
//     const getPolygon = (name) => {
//       return polygonSeries.mapPolygons.values.find((p) => {
//         const d = p.dataItem?.dataContext;

//         return (
//           d?.name === name ||
//           d?.properties?.name === name ||
//           d?.properties?.ADMIN === name
//         );
//       });
//     };

//     /* ---------------- DRAW LINES ---------------- */
//     polygonSeries.events.on("datavalidated", () => {
//       const parentName = normalizeFromAPI(
//         apiData[0].parent_country_name
//       );

//       const parentPolygon = getPolygon(parentName);

//       if (!parentPolygon) {
//         console.log("❌ Parent not found:", parentName);
//         return;
//       }

//       const parentCentroid = parentPolygon.geoCentroid();

//       apiData.forEach((item) => {
//         const targetName = normalizeFromAPI(
//           item.collaboration_country_name
//         );

//         const targetPolygon = getPolygon(targetName);

//         if (!targetPolygon) {
//           console.log("❌ Missing:", targetName);
//           return;
//         }

//         const targetCentroid = targetPolygon.geoCentroid();

//         lineSeries.data.push({
//           geometry: {
//             type: "LineString",
//             coordinates: [parentCentroid, targetCentroid],
//           },
//         });
//       });
//     });

//     /* ---------------- CLICK ---------------- */
//     polygonSeries.mapPolygons.template.events.on("click", (ev) => {
//       const d = ev.target.dataItem.dataContext;

//       const country =
//         d.name || d.properties?.name || d.properties?.ADMIN;

//       if (activePolygonRef.current) {
//         activePolygonRef.current.states.applyAnimate("default");
//       }

//       ev.target.states.applyAnimate("active");
//       activePolygonRef.current = ev.target;
//       setSelectedCountry(country);
//     });

//     chart.appear(1000, 100);

//     return () => root.dispose();
//   }, [apiData]);

//   return (
//     <div style={{ position: "relative", width: "100%", height: "500px" }}>
//       {/* MAP */}
//       <div
//         ref={chartRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           filter: selectedCountry
//             ? "brightness(0.6) blur(1px)"
//             : "none",
//         }}
//       />

//       {/* SANKEY POPUP */}
//       {selectedCountry && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 460,
//             background: "#fff",
//             borderRadius: 12,
//             boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
//             zIndex: 20,
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               padding: "12px 16px",
//               background: "#1565c0",
//               color: "#fff",
//             }}
//           >
//             <strong>{selectedCountry}</strong>
//             <span
//               style={{ cursor: "pointer" }}
//               onClick={() => setSelectedCountry(null)}
//             >
//               ✕
//             </span>
//           </div>

//           <div style={{ padding: 12 }}>
//             <PatentSankey
//               data={getSankeyData(selectedCountry)}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicationCollaboration;

// import React, { useEffect, useRef, useState } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5map from "@amcharts/amcharts5/map";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import * as topojson from "topojson-client";
// import { useParams } from "react-router-dom";

// import worldData from "./countries-topo.json";

// const PublicationCollaboration = () => {
//   const chartRef = useRef(null);
//   const activePolygonRef = useRef(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [apiData, setApiData] = useState([]);
//   const { sub_tech_id } = useParams();

//   /* ---------------- FETCH API ---------------- */
//   useEffect(() => {
//     fetch(
//       `https://development.stieahub.in/Codigniter_api/public/publication_international_collaboration/${sub_tech_id}`
//     )
//       .then((res) => res.json())
//       .then((data) => setApiData(data))
//       .catch((err) => console.error(err));
//   }, [sub_tech_id]);

//   /* ---------------- NAME NORMALIZATION ---------------- */
//   const normalizeToAPI = (name) => {
//     const map = {
//       "United States of America": "USA",
//       "United Kingdom": "UK",
//     };
//     return map[name] || name;
//   };

//   /* ---------------- TABLE DATA ---------------- */
//   const getTableData = (country) => {
//     if (!apiData.length || !country) return [];

//     const apiCountry = normalizeToAPI(country);

//     const data = apiData
//       .filter((item) => item.parent_country_name === apiCountry)
//       .map((item) => ({
//         country: item.collaboration_country_name,
//         papers: Number(item.collaboration_papers),
//       }));

//     // sort descending
//     return data.sort((a, b) => b.papers - a.papers);
//   };

//   /* ---------------- TOTAL COUNT ---------------- */
//   const getTotalCount = (country) => {
//     const apiCountry = normalizeToAPI(country);

//     return apiData
//       .filter((item) => item.parent_country_name === apiCountry)
//       .reduce(
//         (sum, item) => sum + Number(item.collaboration_papers),
//         0
//       );
//   };

//   /* ---------------- MAP ---------------- */
//   useEffect(() => {
//     if (!apiData.length) return;

//     const geoObjectName = Object.keys(worldData.objects)[0];
//     const geojson = topojson.feature(
//       worldData,
//       worldData.objects[geoObjectName]
//     );

//     const root = am5.Root.new(chartRef.current);
//     root.setThemes([am5themes_Animated.new(root)]);
//     root._logo.dispose();

//     const chart = root.container.children.push(
//       am5map.MapChart.new(root, {
//         projection: am5map.geoMercator(),
//         panX: "none",
//         panY: "none",
//         wheelX: "none",
//         wheelY: "none",
//       })
//     );

//     /* ---------------- POLYGONS ---------------- */
//     const polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: geojson,
//       })
//     );

//     polygonSeries.mapPolygons.template.setAll({
//       interactive: true,
//       fill: am5.color(0xe3f2fd),
//       stroke: am5.color(0x1e88e5),
//       strokeWidth: 0.8,
//       tooltipText:
//         "{name}\nTotal Collaborations: {collabCount}",
//     });

//     polygonSeries.mapPolygons.template.states.create("hover", {
//       fill: am5.color(0x90caf9),
//     });

//     polygonSeries.mapPolygons.template.states.create("active", {
//       fill: am5.color(0x1565c0),
//     });

//     /* ---------------- TOOLTIP COUNTS ---------------- */
//     polygonSeries.events.on("datavalidated", () => {
//       polygonSeries.mapPolygons.each((polygon) => {
//         const d = polygon.dataItem.dataContext;

//         const name =
//           d.name || d.properties?.name || d.properties?.ADMIN;

//         polygon.dataItem.set(
//           "collabCount",
//           getTotalCount(name)
//         );
//       });
//     });

//     /* ---------------- CLICK ---------------- */
//     polygonSeries.mapPolygons.template.events.on("click", (ev) => {
//       const d = ev.target.dataItem.dataContext;

//       const country =
//         d.name || d.properties?.name || d.properties?.ADMIN;

//       const hasData = getTableData(country).length > 0;

//       if (!hasData) return;

//       if (activePolygonRef.current) {
//         activePolygonRef.current.states.applyAnimate("default");
//       }

//       ev.target.states.applyAnimate("active");
//       activePolygonRef.current = ev.target;
//       setSelectedCountry(country);
//     });

//     chart.appear(1000, 100);

//     return () => root.dispose();
//   }, [apiData]);

//   return (
//     <div style={{ position: "relative", width: "100%", height: "500px" }}>
//       {/* MAP */}
//       <div
//         ref={chartRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           filter: selectedCountry
//             ? "brightness(0.6) blur(1px)"
//             : "none",
//           transition: "0.3s ease",
//         }}
//       />

//       {/* TABLE POPUP */}
//       {selectedCountry && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 420,
//             background: "#fff",
//             borderRadius: 12,
//             boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
//             zIndex: 20,
//           }}
//         >
//           {/* HEADER */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               padding: "12px 16px",
//               background: "#1565c0",
//               color: "#fff",
//               borderTopLeftRadius: 12,
//               borderTopRightRadius: 12,
//             }}
//           >
//             <strong>{selectedCountry} – Collaborations</strong>
//             <span
//               style={{ cursor: "pointer" }}
//               onClick={() => {
//                 if (activePolygonRef.current) {
//                   activePolygonRef.current.states.applyAnimate(
//                     "default"
//                   );
//                 }
//                 activePolygonRef.current = null;
//                 setSelectedCountry(null);
//               }}
//             >
//               ✕
//             </span>
//           </div>

//           {/* TABLE */}
//           <div style={{ padding: 12 }}>
//             <table
//               style={{
//                 width: "100%",
//                 borderCollapse: "collapse",
//                 fontSize: "14px",
//               }}
//             >
//               <thead>
//                 <tr style={{ background: "#f5f5f5" }}>
//                   <th style={{ padding: "8px", textAlign: "left" }}>
//                     Country
//                   </th>
//                   <th style={{ padding: "8px", textAlign: "right" }}>
//                     Papers
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {getTableData(selectedCountry).map((row, i) => (
//                   <tr key={i}>
//                     <td
//                       style={{
//                         padding: "8px",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {row.country}
//                     </td>
//                     <td
//                       style={{
//                         padding: "8px",
//                         textAlign: "right",
//                         fontWeight: "bold",
//                         borderBottom: "1px solid #eee",
//                       }}
//                     >
//                       {row.papers}
//                     </td>
//                   </tr>
//                 ))}

//                 {/* TOTAL */}
//                 <tr>
//                   <td
//                     style={{
//                       padding: "8px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Total
//                   </td>
//                   <td
//                     style={{
//                       padding: "8px",
//                       textAlign: "right",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {getTotalCount(selectedCountry)}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PublicationCollaboration;


import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as topojson from "topojson-client";

import rawData from "./in_countries.min.geojson";

const PublicationCollaboration = () => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current || !rawData) return;

    let geojson;

    // ✅ Case 1: Already GeoJSON
    if (rawData.type === "FeatureCollection") {
      geojson = rawData;
    }
    // ✅ Case 2: TopoJSON
    else if (rawData.type === "Topology") {
      const objectKey = Object.keys(rawData.objects || {})[0];

      if (!objectKey) {
        console.error("Invalid TopoJSON structure");
        return;
      }

      geojson = topojson.feature(rawData, rawData.objects[objectKey]);
    }
    // ❌ Unknown format
    else {
      console.error("Unsupported map format:", rawData);
      return;
    }

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.dispose();

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geojson,
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0xcfd8dc),
      stroke: am5.color(0x607d8b),
      strokeWidth: 1,
    });

    chart.appear(1000, 100);

    return () => root.dispose();
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "500px",
      }}
    />
  );
};

export default PublicationCollaboration;