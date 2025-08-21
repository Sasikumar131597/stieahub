// import React, { useRef, useEffect, useState, memo } from "react";
// import * as d3 from "d3";
// import * as topojson from "topojson-client";

// // Assuming countries-topo.json is in the same directory.
// import worldData from "./countries-topo.json";

// const WorldMap = () => {
//   const svgRef = useRef();
//   const [tooltipContent, setTooltipContent] = useState("");

//   useEffect(() => {
//     // Check if the SVG reference is valid
//     if (!svgRef.current) return;

//     const svg = d3.select(svgRef.current);
//     const width = 900;
//     const height = 500;

//     // Clear any previous map to avoid duplication on re-render
//     svg.selectAll("*").remove();

//     // Dynamically get the name of the countries object from the TopoJSON file
//     const geoObjectName = Object.keys(worldData.objects)[0];
//     const countries = topojson.feature(worldData, worldData.objects[geoObjectName]);

//     // Define the projection
//     const projection = d3.geoMercator().fitSize([width, height], countries);

//     // Define a geographic path generator
//     const pathGenerator = d3.geoPath().projection(projection);

//     // Create a group element for the map paths
//     const g = svg.append("g");

//     // Add the countries to the group
//     g.append("g")
//       .attr("class", "countries")
//       .selectAll("path")
//       .data(countries.features)
//       .join("path")
//       .attr("d", pathGenerator)
//       // Set initial styles for the countries
//       .style("fill", "#7b7bacff")
//       .style("stroke", "#c4c4c4") // A light gray color for the boundaries
//       .style("stroke-width", "0.5px") // A small stroke width to make the boundaries visible
//       .style("outline", "none")
//       // Event handler for when the mouse enters a country
//       .on("mouseenter", (event, d) => {
//         d3.select(event.target)
//           .style("fill", "#f5f5f5") // Hover fill color
//           .style("stroke", "#0056b3") // Highlighted boundary color
//           .style("stroke-width", "1.5px") // Thicker boundary stroke on hover
//           .style("cursor", "pointer")
//           .raise(); // Brings the hovered country to the front to prevent it from being hidden by other countries' strokes
//         setTooltipContent(d.properties.name);
//       })
//       // Event handler for when the mouse leaves a country
//       .on("mouseleave", (event) => {
//         d3.select(event.target)
//           .style("fill", "#7b7bacff") // Default fill color
//           .style("stroke", "#c4c4c4") // Default boundary color
//           .style("stroke-width", "0.5px") // Default boundary stroke width
//           .style("cursor", "default");
//         setTooltipContent("");
//       });

//     // Implement zoom and pan behavior
//     const zoom = d3
//       .zoom()
//       .scaleExtent([1, 8]) // Limits how far you can zoom in/out
//       .on("zoom", (event) => {
//         g.attr("transform", event.transform);
//       });

//     // Apply the zoom behavior to the SVG
//     svg.call(zoom);

//   }, []); // IMPORTANT: The dependency array should be empty for a single-render map

//   return (
//     <div style={{
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       fontFamily: "Arial, sans-serif",
//       backgroundColor: "#f5f5f5",
//       padding: "20px",
//       borderRadius: "10px",
//       boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
//     }}>
//       <h2 style={{ color: "#333", marginBottom: "20px" }}>World Map (D3)</h2>
//       <div style={{
//         position: "relative",
//         width: "100%",
//         maxWidth: "800px",
//         height: "500px", // A fixed height is often needed for D3
//         border: "1px solid #ddd",
//         borderRadius: "5px",
//         overflow: "hidden"
//       }}>
//         <svg ref={svgRef} width="100%" height="100%" />
//         {tooltipContent && (
//           <div style={{
//             position: "absolute",
//             top: "10px",
//             left: "10px",
//             backgroundColor: "rgba(0, 0, 0, 0.7)",
//             color: "white",
//             padding: "5px 10px",
//             borderRadius: "5px",
//             fontSize: "14px",
//             pointerEvents: "none"
//           }}>
//             {tooltipContent}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default memo(WorldMap);


import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as topojson from "topojson-client";

// Import your TopoJSON file
import worldData from "./countries-topo.json";

const WorldMap = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Convert TopoJSON to GeoJSON for amCharts
    const geoObjectName = Object.keys(worldData.objects)[0];
    const geojson = topojson.feature(
      worldData,
      worldData.objects[geoObjectName]
    );

    // Create root
    const root = am5.Root.new(chartRef.current);

    // Apply theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
      })
    );

    // Create polygon series from your GeoJSON
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geojson,
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      toggleKey: "active",
      interactive: true,
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover"),
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: root.interfaceColors.get("primaryButtonHover"),
    });

    let previousPolygon;
    polygonSeries.mapPolygons.template.on("active", (active, target) => {
      if (previousPolygon && previousPolygon !== target) {
        previousPolygon.set("active", false);
      }
      if (target.get("active")) {
        polygonSeries.zoomToDataItem(target.dataItem);
      } else {
        chart.goHome();
      }
      previousPolygon = target;
    });

    // Add zoom control
    const zoomControl = chart.set(
      "zoomControl",
      am5map.ZoomControl.new(root, {})
    );
    zoomControl.homeButton.set("visible", true);

    // Set clicking on "water" to zoom out
    chart.chartContainer.get("background").events.on("click", () => {
      chart.goHome();
    });

    // Animate on load
    chart.appear(1000, 100);

    // Cleanup
    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "500px" }}
    />
  );
};

export default WorldMap;
