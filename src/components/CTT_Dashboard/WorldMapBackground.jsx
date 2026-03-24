// import {
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";

// const geoUrl =
//   "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// export default function WorldMapBackground() {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         zIndex: -1,
//         pointerEvents: "none",
//         overflow: "hidden",
//         opacity: 0.45 // 👈 stronger visibility
//       }}
//     >
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{
//           scale: 185,
//           center: [0, 18]
//         }}
//         width={1000}
//         height={500}
//         style={{
//           width: "100%",
//           height: "100%"
//         }}
//       >
//         {/* Enhanced glow */}
//         <defs>
//           <filter id="highlightGlow">
//             <feGaussianBlur stdDeviation="1.2" result="blur" />
//             <feMerge>
//               <feMergeNode in="blur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>

//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => (
//               <Geography
//                 key={geo.rsmKey}
//                 geography={geo}
//                 fill="#D1D5DB"          // darker fill
//                 stroke="#6B7280"       // stronger borders
//                 strokeWidth={0.9}      // thicker lines
//                 filter="url(#highlightGlow)"
//                 style={{
//                   default: { outline: "none" },
//                   hover: { outline: "none" },
//                   pressed: { outline: "none" }
//                 }}
//               />
//             ))
//           }
//         </Geographies>
//       </ComposableMap>
//     </div>
//   );
// }


import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

export default function WorldMapBackground() {
  const [position, setPosition] = useState({
    coordinates: [0, 20],
    zoom: 1
  });

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({
      ...pos,
      zoom: pos.zoom * 1.5
    }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({
      ...pos,
      zoom: pos.zoom / 1.5
    }));
  };

  const handleReset = () => {
    setPosition({
      coordinates: [0, 20],
      zoom: 1
    });
  };

  const handleMoveEnd = (pos) => {
    setPosition(pos);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        // zIndex: -1,
        background: "#0f172a"
      }}
    >
      {/* Controls */}
      {/* <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 10
        }}
      >
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
        <button onClick={handleReset}>Reset</button>
      </div> */}

      <ComposableMap
        projection="geoMercator"
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isIndia = geo.properties.ADMIN === "India";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isIndia ? "#22c55e" : "#1e293b",
                        stroke: "#334155",
                        strokeWidth: isIndia ? 0.8 : 0.3,
                        outline: "none"
                      },
                      hover: {
                        fill: "#38bdf8",
                        outline: "none"
                      },
                      pressed: {
                        fill: "#0ea5e9",
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}



// WorldMapBackground.jsx
// import React, { useEffect, useRef } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5map from "@amcharts/amcharts5/map";
// import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

// const WorldMapBackground = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const root = am5.Root.new(chartRef.current);
    
//     const chart = root.container.children.push(
//       am5map.MapChart.new(root, {
//         panX: "none",
//         panY: "none",
//         wheelX: "none",
//         wheelY: "none",
//         projection: am5map.geoMercator(),
//       })
//     );

//     // World polygon series
//     const polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(root, {
//         geoJSON: am5geodata_worldLow,
//         exclude: ["AQ"], // Exclude Antarctica
//       })
//     );

//     // Style polygons
//     polygonSeries.mapPolygons.template.setAll({
//       fill: am5.color(0xD6D6D6),
//       stroke: am5.color(0xFFFFFF),
//       strokeWidth: 0.5,
//       tooltipText: "{name}",
//     });

//     // Highlight India
//     polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
//       if (target.dataItem?.dataContext?.id === "IND") {
//         return am5.color(0x4A90E2); // Blue for India
//       }
//       return fill;
//     });

//     return () => root.dispose();
//   }, []);

//   return <div ref={chartRef} style={{ width: "100%", height: "100vh" }} />;
// };

// export default WorldMapBackground;
