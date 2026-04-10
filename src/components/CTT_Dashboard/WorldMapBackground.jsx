// import React from "react";
// import {
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";
// import geoData from "./";

// const geoUrl =
//   "http://sticonnect.info/assets/js/in_countries.min.geojson";

  

// export default function WorldMapBackground() {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         inset: 0,
//         background: "#0f172a"
//       }}
//     >
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{
//           scale: 150,
//           center: [0, 20]
//         }}
//         style={{
//           width: "100%",
//           height: "100%"
//         }}
//       >
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => {
//               const isIndia = geo.properties.ADMIN === "India";

//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   style={{
//                     default: {
//                       fill: isIndia ? "#22c55e" : "#1e293b",
//                       stroke: "#334155",
//                       strokeWidth: isIndia ? 0.8 : 0.3,
//                       outline: "none"
//                     },
//                     hover: {
//                       fill: "#38bdf8",
//                       outline: "none"
//                     },
//                     pressed: {
//                       fill: "#0ea5e9",
//                       outline: "none"
//                     }
//                   }}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>
//     </div>
//   );
// }





// import React from "react";
// import {
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";

// const geoUrl =
//   "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

// export default function WorldMapBackground() {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         inset: 0,
//         background: "#0f172a",
//         pointerEvents: "none" 
//       }}
//     >
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{
//           scale: 150,
//           center: [0, 20]
//         }}
//         style={{
//           width: "100%",
//           height: "100%"
//         }}
//       >
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => {
//               const isIndia = geo.properties.ADMIN === "India";

//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   style={{
//                     default: {
//                       fill: isIndia ? "#22c55e" : "#1e293b",
//                       stroke: "#334155",
//                       strokeWidth: isIndia ? 0.8 : 0.3,
//                       outline: "none"
//                     },
//                     hover: {
//                       fill: isIndia ? "#22c55e" : "#1e293b",
//                       outline: "none"
//                     },
//                     pressed: {
//                       fill: isIndia ? "#22c55e" : "#1e293b",
//                       outline: "none"
//                     }
//                   }}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>
//     </div>
//   );
// }

// import React from "react";
// import {
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";

// // ✅ use attached/local geojson file
// import geoData from "./in_countries.min.geojson";

// export default function WorldMapBackground() {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         inset: 0,
//         background: "#0f172a",
//         pointerEvents: "none" // ✅ disables all interactions
//       }}
//     >
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{
//           scale: 150,
//           center: [0, 20]
//         }}
//         style={{
//           width: "100%",
//           height: "100%"
//         }}
//       >
//         {/* ✅ pass local geojson */}
//         <Geographies geography={geoData}>
//           {({ geographies }) =>
//             geographies.map((geo) => {
//               // ✅ handle different possible property keys
//               const isIndia =
//                 geo.properties.ADMIN === "India" ||
//                 geo.properties.name === "India";

//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   style={{
//                     default: {
//                       fill: isIndia ? "#22c55e" : "#1e293b",
//                       stroke: "#334155",
//                       strokeWidth: isIndia ? 0.8 : 0.3,
//                       outline: "none"
//                     },
//                     // ❌ no hover effect (same as default)
//                     hover: {
//                       fill: isIndia ? "#22c55e" : "#1e293b",
//                       outline: "none"
//                     },
//                     pressed: {
//                       fill: isIndia ? "#22c55e" : "#1e293b",
//                       outline: "none"
//                     }
//                   }}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>
//     </div>
//   );
// }

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

// ✅ use your attached geojson file
import geoData from "./in_countries.min.geojson";

export default function WorldMapBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#9ba4b9",
        pointerEvents: "none" // ✅ fully non-interactive
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 150,
          center: [0, 20]
        }}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "#1e293b",      // ✅ same color for all countries
                    stroke: "#334155",
                    strokeWidth: 0.3,
                    outline: "none"
                  },
                  hover: {
                    fill: "#1e293b",      // ✅ no hover effect
                    outline: "none"
                  },
                  pressed: {
                    fill: "#1e293b",      // ✅ no click effect
                    outline: "none"
                  }
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}