// import {
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";

// const geoUrl =
//   "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// export default function WorldMapBackground() {
//   return (
//     <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
//       <ComposableMap projectionConfig={{ scale: 160 }}>
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => (
//               <Geography
//                 key={geo.rsmKey}
//                 geography={geo}
//                 fill="#eaeaea"
//                 stroke="#ccc"
//               />
//             ))
//           }
//         </Geographies>
//       </ComposableMap>
//     </div>
//   );
// }



import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMapBackground() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        opacity: 0.45 // 👈 stronger visibility
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 185,
          center: [0, 18]
        }}
        width={1000}
        height={500}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        {/* Enhanced glow */}
        <defs>
          <filter id="highlightGlow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#D1D5DB"          // darker fill
                stroke="#6B7280"       // stronger borders
                strokeWidth={0.9}      // thicker lines
                filter="url(#highlightGlow)"
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
