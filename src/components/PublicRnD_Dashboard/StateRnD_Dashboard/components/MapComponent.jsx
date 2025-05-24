import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleSequential } from "d3-scale";
import { interpolatePurples } from "d3-scale-chromatic"; // Added color scale
import { geoMercator, geoCentroid } from "d3-geo";
import indiaTopoJSON2014_19 from "../../../helpers/Maps/India-States-2014-19.json";
import indiaTopoJSON2019_25 from "../../../helpers/Maps/India-States-2019-2025.json";

// D3 Projection
const projection = geoMercator().scale(650).center([80, 24]); // Adjusted projection

const MapComponent = ({ stateData, valueType, yearRange }) => {
  const [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0, visible: false });

  // Compute min & max dynamically
  const [minValue, maxValue] = useMemo(() => {
    if (!stateData) return [0, 100]; // Default range if no data is available

    const values = Object.values(stateData)
      .flat()
      .filter(v => v !== null && v !== undefined);

    if (values.length === 0) return [0, 100]; // Handle case where all values are null or undefined

    return [Math.min(...values), Math.max(...values)];
  }, [stateData]);

  // Define a dynamic color scale based on valueType
  const colorScale = useMemo(() => {
    return scaleSequential(valueType === "currency" ? interpolatePurples : interpolatePurples).domain([minValue, maxValue]);
  }, [minValue, maxValue, valueType]);

  const colorLegend = useMemo(() => {
    const numTicks = 10;
    const ticks = Array.from({ length: numTicks }, (_, index) => minValue + ((maxValue - minValue) / (numTicks - 1)) * index);
    return ticks;
  }, [minValue, maxValue]);

  // Load the appropriate shapefile based on the year range

  const shapefile = yearRange === "2014-19" ? indiaTopoJSON2014_19 : indiaTopoJSON2019_25;
  return (
    <div style={{
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "85%",
      height: "75vh",
      overflow: "hidden",
      border: "1px solid #ddd",
      borderRadius: "8px",
      marginLeft: "5%",
    }}>
      {/* Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: "absolute",
          top: `${tooltip.y}px`,
          left: `${tooltip.x}px`,
          backgroundColor: "#fff",
          padding: "8px",
          borderRadius: "5px",
          boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
          fontSize: "12px",
          fontWeight: "bold",
          pointerEvents: "none",
          transform: "translate(-50%, -100%)",
          whiteSpace: "nowrap"
        }}>
          {tooltip.text}
        </div>
      )}

      {/* Interactive Map with Restricted Panning */}
      <ComposableMap projection={projection} style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup
          center={[82, 22]}
          zoom={1.5}
          translateExtent={[[100, 80], [800, 550]]}
          minZoom={1}
          maxZoom={4}
        >
          <Geographies geography={shapefile}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.ST_NM || geo.properties.st_nm;
                const value = stateData[stateName]; // Get state data
                const isDataAvailable = value !== undefined && value !== null;
                const fillColor = isDataAvailable ? colorScale(value) : "#ddd"; // Gray if data is missing

                // Calculate state centroid coordinates
                const centroid = geoCentroid(geo);
                const [x, y] = projection(centroid) || [0, 0]; // Prevent undefined error
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#000"
                    strokeWidth={0.6}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#f5c490", outline: "none" },
                      pressed: { fill: "#f5a390", outline: "none" },
                    }}
                    onMouseEnter={() => {
                      let formattedValue = isDataAvailable
                        ? valueType === "currency"
                          ? `₹${value} Cr`
                          : `${value}%`
                        : "Data Not Available";

                      setTooltip({
                        text: `${stateName}: ${formattedValue}`,
                        x: x, // Use calculated projection
                        y: y - 20, // Offset slightly upwards
                        visible: true
                      });
                    }}
                    onMouseLeave={() => setTooltip({ text: "", x: 0, y: 0, visible: false })}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Color Legend */}
      <div style={{
        position: "absolute",
        bottom: "10px",
        left: "5%",
        width: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "12px",
        color: "#333"
      }}>
        {/* Color Gradient Bar */}
        <div style={{
          width: "100%",
          height: "10px",
          background: `linear-gradient(to right, ${colorScale(minValue)} 0%, ${colorScale(maxValue)} 100%)`
        }} />

        {/* Tick Labels */}
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "5px",
        }}>
          {colorLegend.map((tick, index) => (
            <span key={index} style={{ textAlign: "center", width: `${100 / (colorLegend.length - 1)}%` }}>
             {valueType === "currency"
                ? `₹${Math.round(tick)} Cr`
                : `${(tick ).toFixed(5)}%`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;