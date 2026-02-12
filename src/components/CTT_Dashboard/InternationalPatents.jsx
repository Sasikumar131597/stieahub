// import React, { useEffect, useRef, useState } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5map from "@amcharts/amcharts5/map";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import * as topojson from "topojson-client";

// import worldData from "./countries-topo.json";
// import PatentSankey from "./PatentSankey";

// /* ---------------- COUNTRY COORDINATES ---------------- */
// const countryCoords = {
//   India: [77.1025, 28.7041],
//   "United Kingdom": [-0.1276, 51.5074],
//   France: [2.3522, 48.8566],
//   Japan: [139.6917, 35.6895]
// };

// /* ---------------- MOCK COLLABORATION DATA ---------------- */
// const collaborationData = {
//   India: {
//     partners: [
//       { country: "United Kingdom", count: 42 },
//       { country: "France", count: 28 },
//       { country: "Japan", count: 55 }
//     ]
//   },
//   "United Kingdom": {
//     partners: [
//       { country: "India", count: 42 },
//       { country: "France", count: 18 }
//     ]
//   },
//   France: {
//     partners: [
//       { country: "India", count: 28 },
//       { country: "United Kingdom", count: 18 }
//     ]
//   },
//   Japan: {
//     partners: [{ country: "India", count: 55 }]
//   }
// };

// /* ---------------- SANKEY DATA BUILDER ---------------- */
// const getSankeyData = (country) =>
//   collaborationData[country].partners.map((p) => ({
//     from: country,
//     to: p.country,
//     value: p.count
//   }));

// const InternationalPatents = () => {
//   const chartRef = useRef(null);
//   const activePolygonRef = useRef(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);

//   useEffect(() => {
//     const geoObjectName = Object.keys(worldData.objects)[0];
//     const geojson = topojson.feature(
//       worldData,
//       worldData.objects[geoObjectName]
//     );

//     const root = am5.Root.new(chartRef.current);
//     root.setThemes([am5themes_Animated.new(root)]);
//     root._logo.dispose();

//     /* ---------------- MAP ---------------- */
//     const chart = root.container.children.push(
//       am5map.MapChart.new(root, {
//         projection: am5map.geoMercator(),
//         panX: "none",
//         panY: "none",
//         wheelX: "none",
//         wheelY: "none"
//       })
//     );

//     /* ---------------- COUNTRIES ---------------- */
//     const polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: geojson
//       })
//     );

//     polygonSeries.mapPolygons.template.setAll({
//       interactive: true,
//       fill: am5.color(0xe3f2fd),
//       stroke: am5.color(0x1e88e5),
//       strokeWidth: 0.8,
//       tooltipText: "{name}"
//     });

//     polygonSeries.mapPolygons.template.states.create("hover", {
//       fill: am5.color(0x90caf9)
//     });

//     polygonSeries.mapPolygons.template.states.create("active", {
//       fill: am5.color(0x1565c0)
//     });

//     polygonSeries.mapPolygons.template.events.on("click", (ev) => {
//       const country = ev.target.dataItem.dataContext.name;
//       if (!collaborationData[country]) return;

//       if (activePolygonRef.current) {
//         activePolygonRef.current.states.applyAnimate("default");
//       }

//       ev.target.states.applyAnimate("active");
//       activePolygonRef.current = ev.target;
//       setSelectedCountry(country);
//     });

//     chart.appear(1000, 100);
//     return () => root.dispose();
//   }, []);

//   return (
//     <div style={{ position: "relative", width: "100%", height: "600px" }}>
//       {/* MAP */}
//       <div
//         ref={chartRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           filter: selectedCountry
//             ? "brightness(0.5) blur(1px)"
//             : "none",
//           transition: "0.3s ease"
//         }}
//       />

//       {/* BIG POPUP */}
//       {selectedCountry && (
//         <div
//           style={{
//             // position: "absolute",
//             // inset: "5%",
//             // background: "#ffffff",
//             // borderRadius: 14,
//             // boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
//             // zIndex: 30,
//             // display: "flex",
//             // flexDirection: "column"
//             position: "absolute",
//             top: 20,
//             right: 20,

//             width: 420,
//             height: 320,

//             background: "#ffffff",
//             borderRadius: 12,
//             boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
//             zIndex: 30,
//             display: "flex",
//             flexDirection: "column"
//           }}
//         >
//           {/* HEADER */}
//           <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 padding: "8px 12px",
//                 background: "#1565c0",
//                 color: "#fff",
//                 borderTopLeftRadius: 12,
//                 borderTopRightRadius: 12,
//                 fontSize: 14
//               }}
//             >

//             <strong style={{ fontSize: 16 }}>
//               {selectedCountry} – International Patent Collaboration
//             </strong>
//             <span
//               style={{ cursor: "pointer", fontSize: 20 }}
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

//           {/* SANKEY FULL AREA */}
//           <div
//             style={{
//               flex: 1,
//               padding: "8px 10px",
//               overflow: "hidden"
//             }}
//           >
//             <PatentSankey data={getSankeyData(selectedCountry)} />
//           </div>

//         </div>
//       )}
//     </div>
//   );
// };

// export default InternationalPatents;


import React, { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as topojson from "topojson-client";

import worldData from "./countries-topo.json";
import PatentSankey from "./PatentSankey";

/* ---------------- COUNTRY COORDINATES ---------------- */
const countryCoords = {
  India: [77.1025, 28.7041],
  "United Kingdom": [-0.1276, 51.5074],
  France: [2.3522, 48.8566],
  Japan: [139.6917, 35.6895]
};

/* ---------------- MOCK COLLABORATION DATA ---------------- */
const collaborationData = {
  India: {
    total: 125,
    partners: [
      { country: "United Kingdom", count: 42 },
      { country: "France", count: 28 },
      { country: "Japan", count: 55 }
    ]
  },
  "United Kingdom": {
    total: 60,
    partners: [
      { country: "India", count: 42 },
      { country: "France", count: 18 }
    ]
  },
  France: {
    total: 46,
    partners: [
      { country: "India", count: 28 },
      { country: "United Kingdom", count: 18 }
    ]
  },
  Japan: {
    total: 55,
    partners: [{ country: "India", count: 55 }]
  }
};

/* ---------------- HELPER: TABLE → SANKEY ---------------- */
const getSankeyData = (country) =>
  collaborationData[country].partners.map((p) => ({
    from: country,
    to: p.country,
    value: p.count
  }));

const InternationalPatents = () => {
  const chartRef = useRef(null);
  const activePolygonRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const geoObjectName = Object.keys(worldData.objects)[0];
    const geojson = topojson.feature(
      worldData,
      worldData.objects[geoObjectName]
    );

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.dispose();

    /* ---------------- MAP ---------------- */
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none"
      })
    );

    /* ---------------- COUNTRY POLYGONS ---------------- */
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geojson
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      interactive: true,
      fill: am5.color(0xe3f2fd),
      stroke: am5.color(0x1e88e5),
      strokeWidth: 0.8,
      tooltipText:
        "{name}\nTotal Collaborations: {collabCount}"
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x90caf9)
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: am5.color(0x1565c0)
    });

    polygonSeries.events.on("datavalidated", () => {
      polygonSeries.mapPolygons.each((polygon) => {
        const name = polygon.dataItem.dataContext.name;
        polygon.dataItem.set(
          "collabCount",
          collaborationData[name]?.total || 0
        );
      });
    });

    polygonSeries.mapPolygons.template.events.on("click", (ev) => {
      const country = ev.target.dataItem.dataContext.name;
      if (!collaborationData[country]) return;

      if (activePolygonRef.current) {
        activePolygonRef.current.states.applyAnimate("default");
      }

      ev.target.states.applyAnimate("active");
      activePolygonRef.current = ev.target;
      setSelectedCountry(country);
    });

    /* ---------------- MAP POINTS ---------------- */
    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 6,
          fill: am5.color(0xff5252),
          stroke: am5.color(0xffffff),
          strokeWidth: 2
        })
      })
    );

    pointSeries.data.setAll(
      Object.keys(countryCoords).map((country) => ({
        geometry: {
          type: "Point",
          coordinates: countryCoords[country]
        }
      }))
    );

    chart.appear(1000, 100);
    return () => root.dispose();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* MAP */}
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "100%",
          filter: selectedCountry
            ? "brightness(0.6) blur(1px)"
            : "none",
          transition: "0.3s ease"
        }}
      />

      {/* SANKEY POPUP */}
      {selectedCountry && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 460,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
            zIndex: 20
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              background: "#1565c0",
              color: "#fff",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
            }}
          >
            <strong>
              {selectedCountry} – Patent Collaboration Flow
            </strong>
            <span
              style={{ cursor: "pointer", fontSize: 18 }}
              onClick={() => {
                if (activePolygonRef.current) {
                  activePolygonRef.current.states.applyAnimate(
                    "default"
                  );
                }
                activePolygonRef.current = null;
                setSelectedCountry(null);
              }}
            >
              ✕
            </span>
          </div>

          {/* SANKEY */}
          <div style={{ padding: 12 }}>
            <PatentSankey
              data={getSankeyData(selectedCountry)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InternationalPatents;

