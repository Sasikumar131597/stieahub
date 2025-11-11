import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as topojson from "topojson-client";

// Import your TopoJSON file
import worldData from "./countries-topo.json";

const InternationalPatents = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const geoObjectName = Object.keys(worldData.objects)[0];
    const geojson = topojson.feature(
      worldData,
      worldData.objects[geoObjectName]
    );

    const root = am5.Root.new(chartRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    root._logo.dispose();

    // Static (no zoom/pan)
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none"
      })
    );

    // Country polygons
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geojson
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      interactive: true,
      fill: am5.color(0xadd8e6), // light blue
      stroke: am5.color(0xffffff),
      strokeWidth: 0.7
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x87ceeb) // slightly darker blue on hover
    });

    // Markers
    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    pointSeries.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 6,
          fill: am5.color(0xff0000),
          tooltipText: "{title}"
        })
      })
    );

    pointSeries.data.setAll([
      { title: "Delhi (India)", geometry: { type: "Point", coordinates: [77.1025, 28.7041] } },
      { title: "Paris (France)", geometry: { type: "Point", coordinates: [2.3522, 48.8566] } },
      { title: "United Kingdom", geometry: { type: "Point", coordinates: [-0.1276, 51.5074] } },
      { title: "Tokyo (Japan)", geometry: { type: "Point", coordinates: [139.6917, 35.6895] } }
    ]);

    // Connections (optional)
    const lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: am5.color(0x2979ff),
      strokeWidth: 2,
      strokeOpacity: 0.6
    });

    lineSeries.data.setAll([
      {
        geometry: {
          type: "LineString",
          coordinates: [
            [77.1025, 28.7041], // Delhi
            [-0.1276, 51.5074] // London
          ]
        }
      },
      {
        geometry: {
          type: "LineString",
          coordinates: [
            [77.1025, 28.7041], // Delhi (India)
            [2.3522, 48.8566]   // Paris (France)
          ]
        }
      },
       {
          geometry: {
            type: "LineString",
            coordinates: [
              [77.1025, 28.7041], // Delhi (India)
              [139.6917, 35.6895] // Tokyo (Japan)
            ]
          }
        },
    ]);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "500px" }} />;
};

export default InternationalPatents;
