import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";
import { geoMercator, geoCentroid } from "d3-geo";
import indiaNewMap from "../../../helpers/Maps/India-States-2019-2025.json";

const dummyStateData = {
  "ANDAMAN & NICOBAR": 54.49,
  "BIHAR": 53.56,
  "CHANDIGARH": 42.04,
  "CHHATTISGARH": 80.8,
  "DADRA & NAGAR HAVELI & DAMAN & DIU": 70.93,
  "DELHI": 84.55,
  "DISPUTED (MADHYA PRADESH & GUJARAT)": 13.95,
  "DISPUTED (MADHYA PRADESH & RAJASTHAN)": 13.14,
  "DISPUTED (RAJATHAN & GUJARAT)": 41.84,
  "DISPUTED (WEST BENGAL , BIHAR & JHARKHAND)": 65.47,
  "GOA": 35.25,
  "GUJARAT": 50.8,
  "HARYANA": 89.67,
  "JAMMU AND KASHMIR": 24.64,
  "JHARKHAND": 38.37,
  "KARNATAKA": 33.21,
  "KERALA": 54.88,
  "LADAKH": 40.18,
  "MADHYA PRADESH": 80.22,
  "MAHARASHTRA": 70.31,
  "PUNJAB": 86.58,
  "RAJASTHAN": 45.03,
  "TELANGANA": 19.32,
  "UTTARAKHAND": 14.07,
  "UTTAR PRADESH": 24.71,
  "HIMACHAL PRADESH": 75.06,
  "ARUNACHAL PRADESH": 76.71,
  "ASSAM": 29.97,
  "MANIPUR": 78.03,
  "MEGHALAYA": 80.64,
  "MIZORAM": 20.18,
  "NAGALAND": 50.06,
  "SIKKIM": 84.3,
  "TRIPURA": 28.53,
  "ODISHA": 40.29,
  "WEST BENGAL": 39.74,
  "PUDUCHERRY": 55.66,
  "LAKSHADWEEP": 10.36,
  "TAMIL NADU": 95.76,
  "ANDHRA PRADESH": 79.66
};

const projection = geoMercator().scale(650).center([80, 24]);

const MapComponentNew = ({ valueType = "percentage" }) => {
//   const [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0, visible: false });
//
//   const [minValue, maxValue] = useMemo(() => {
//     const values = Object.values(dummyStateData);
//     return [Math.min(...values), Math.max(...values)];
//   }, []);
//
//   const colorScale = useMemo(() => scaleSequential(interpolateBlues).domain([minValue, maxValue]), [minValue, maxValue]);
//
//   return (
//     <div style={{ position: "relative", width: "85%", height: "75vh", margin: "auto", border: "1px solid #ccc", borderRadius: "8px" }}>
//       {tooltip.visible && (
//         <div style={{ position: "absolute", top: `${tooltip.y}px`, left: `${tooltip.x}px`, backgroundColor: "#fff", padding: "8px", borderRadius: "5px", boxShadow: "0px 0px 8px rgba(0,0,0,0.2)" }}>
//           {tooltip.text}
//         </div>
//       )}
//
//       <ComposableMap projection={projection} style={{ width: "100%", height: "100%" }}>
//         <ZoomableGroup center={[82, 22]} zoom={1.5} minZoom={1} maxZoom={4}>
//           <Geographies geography={indiaNewMap}>
//             {({ geographies }) =>
//               geographies.map((geo) => {
//                 const stateName = geo.properties.STATE;
//                 const value = dummyStateData[stateName];
//                 const isDataAvailable = value !== undefined;
//                 const fillColor = isDataAvailable ? colorScale(value) : "#ddd";
//                 const centroid = geoCentroid(geo);
//                 const [x, y] = projection(centroid) || [0, 0];
//
//                 return (
//                   <Geography
//                     key={geo.rsmKey}
//                     geography={geo}
//                     fill={fillColor}
//                     stroke="#000"
//                     strokeWidth={0.5}
//                     onMouseEnter={() => {
//                       const formattedValue = isDataAvailable ? `${value.toFixed(2)}%` : "Data Not Available";
//                       setTooltip({ text: `${stateName}: ${formattedValue}`, x, y: y - 20, visible: true });
//                     }}
//                     onMouseLeave={() => setTooltip({ text: "", x: 0, y: 0, visible: false })}
//                   />
//                 );
//               })
//             }
//           </Geographies>
//         </ZoomableGroup>
//       </ComposableMap>
//     </div>
//   );
// };

return (
    <ComposableMap>
      <Geographies geography={indiaNewMap}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  )
}
export default MapComponentNew;
