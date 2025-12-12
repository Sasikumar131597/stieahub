import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

const data = [];

export default function TariffMap() {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current);

    // Remove amCharts logo
    root._logo.dispose();

    // Theme
    let myTheme = am5.Theme.new(root);
    myTheme.rule("Label").setAll({ fontSize: "0.8em" });
    root.setThemes([am5themes_Animated.new(root), myTheme]);

    // Clean minimal map (no zoom, no globe, no switches)
    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        zoomControl: null,
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none"
      })
    );

    // Polygon layers
    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        valueField: "value",
        calculateAggregates: true,
        exclude: ["AQ"]
      })
    );

    // Heat rules
    polygonSeries.set("heatRules", [
      {
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color(0xd3a29f),
        max: am5.color(0x6f0600),
        key: "fill"
      }
    ]);

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value}%",
      fill: am5.color(0xd9cec8),
      stroke: am5.color(0xffffff)
    });

    // Heat legend (range indicator)
    let heatLegend = chart.children.push(
      am5.HeatLegend.new(root, {
        orientation: "vertical",
        startColor: am5.color(0xd3a29f),
        endColor: am5.color(0x6f0600),
        startText: "Low",
        endText: "High",
        // Dynamic step count based on data range
        stepCount: (() => {
          const low = polygonSeries.getPrivate("valueLow") ?? 0;
          const high = polygonSeries.getPrivate("valueHigh") ?? 0;
          const diff = Math.abs(high - low);
          return diff > 0 ? Math.min(10, Math.max(3, Math.round(diff))) : 5;
        })(),
        x: am5.p100,
        centerX: am5.p100,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20
      })
    );

    polygonSeries.mapPolygons.template.events.on("pointerover", ev => {
      heatLegend.showValue(ev.target.dataItem.get("value"));
    });

    polygonSeries.data.setAll(data);

    return () => root.dispose();
  }, []);

  return <div id="chartdiv" ref={chartRef} style={{ width: "100%", height: "600px" }} />;
}

