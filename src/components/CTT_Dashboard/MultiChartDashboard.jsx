import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";


const MultiChartDashboard = () => {
  useLayoutEffect(() => {
    const mainColor = am5.color(0xc83830);
    const secondaryColor = am5.color(0xd9cec8);

    // ✅ Utility: Clean up existing charts if any
    am5.array.each(am5.registry.rootElements, (root) => {
      root.dispose();
    });

    // ----------------------------------------------------
    // 1️⃣ LINE SERIES CHART
    // ----------------------------------------------------
    const makeLineSeriesChart = () => {
      let root = am5.Root.new("linediv");
      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: root.verticalLayout,
        })
      );

      const data = [
        { year: "2021", income: 18.5, expenses: 12.1 },
        { year: "2022", income: 22.2, expenses: 30.5 },
        { year: "2023", income: 39.1, expenses: 34.9 },
        { year: "2024", income: 45.5, expenses: 31.1 },
        { year: "2025", income: 30.6, expenses: 22.2 },
        { year: "2026", income: 34.1, expenses: 32.9 },
      ];

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "year",
          renderer: am5xy.AxisRendererX.new(root, {}),
        })
      );
      xAxis.data.setAll(data);

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, { min: 0, extraMax: 0.1 })
      );

      const createLine = (name, field, color) => {
        const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            name,
            xAxis,
            yAxis,
            valueYField: field,
            categoryXField: "year",
            stroke: color,
            fill: color,
            tooltip: am5.Tooltip.new(root, {
              labelText: "{name}: {valueY}",
            }),
          })
        );
        series.data.setAll(data);
        series.strokes.template.setAll({ strokeWidth: 3 });
      };

      createLine("Income", "income", secondaryColor);
      createLine("Expenses", "expenses", mainColor);

      chart.set("cursor", am5xy.XYCursor.new(root, {}));
      chart.appear(1000, 100);
    };

    // ----------------------------------------------------
    // 2️⃣ RADAR GAUGE
    // ----------------------------------------------------
    const makeRadarGauge = () => {
      const root = am5.Root.new("gaugediv");
      root.setThemes([am5themes_Animated.new(root)]);

      const radar = root.container.children.push(
        am5radar.RadarChart.new(root, {
          radius: am5.percent(90),
          innerRadius: am5.percent(20),
          startAngle: -90,
          endAngle: 180,
        })
      );

      const data = [
        { category: "Europe", value: 80, full: 100 },
        { category: "Asia", value: 70, full: 100 },
        { category: "Africa", value: 60, full: 100 },
        { category: "Oceania", value: 50, full: 100 },
      ];

      const xAxis = radar.xAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          max: 100,
          strictMinMax: true,
          renderer: am5radar.AxisRendererCircular.new(root, {}),
        })
      );

      const yAxis = radar.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "category",
          renderer: am5radar.AxisRendererRadial.new(root, {}),
        })
      );

      yAxis.data.setAll(data);

      const bgSeries = radar.series.push(
        am5radar.RadarColumnSeries.new(root, {
          xAxis,
          yAxis,
          valueXField: "full",
          categoryYField: "category",
          fillOpacity: 0.1,
          strokeOpacity: 0,
        })
      );
      bgSeries.data.setAll(data);

      const fgSeries = radar.series.push(
        am5radar.RadarColumnSeries.new(root, {
          xAxis,
          yAxis,
          valueXField: "value",
          categoryYField: "category",
          fill: mainColor,
          stroke: mainColor,
          tooltipText: "{category}: {valueX}%",
        })
      );
      fgSeries.data.setAll(data);

      radar.appear(2000);
    };

    // ----------------------------------------------------
    // 3️⃣ PIE CHART
    // ----------------------------------------------------
    const makePieChart = () => {
      const root = am5.Root.new("piediv");
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          innerRadius: am5.percent(70),
        })
      );

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
        })
      );

      series.data.setAll([
        { category: "One", value: 40, settings: { fill: mainColor } },
        { category: "Two", value: 60, settings: { fill: secondaryColor } },
      ]);

      chart.seriesContainer.children.push(
        am5.Label.new(root, {
          text: "My Title",
          fontSize: 12,
          centerX: am5.p50,
          centerY: am5.p50,
        })
      );

      series.appear(1000);
    };

    // ----------------------------------------------------
    // 4️⃣ COLUMN CHART
    // ----------------------------------------------------
    const makeColumnChart = () => {
      const root = am5.Root.new("columndiv");
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
        })
      );

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "date",
          renderer: am5xy.AxisRendererX.new(root, {}),
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );

      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          xAxis,
          yAxis,
          categoryXField: "date",
          valueYField: "value",
          fill: mainColor,
          stroke: mainColor,
          tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" }),
        })
      );

      const data = [
        { date: "Day 1", value: 40 },
        { date: "Day 2", value: 55 },
        { date: "Day 3", value: 60 },
        { date: "Day 4", value: 50 },
        { date: "Day 5", value: 70 },
      ];
      xAxis.data.setAll(data);
      series.data.setAll(data);

      chart.appear(1000);
    };

    // ----------------------------------------------------
    // 5️⃣ MAP CHART
    // ----------------------------------------------------
    const makeMapChart = () => {
      const root = am5.Root.new("mapdiv");
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoNaturalEarth1(),
        })
      );

      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"],
          valueField: "value",
        })
      );

      polygonSeries.set("heatRules", [
        {
          target: polygonSeries.mapPolygons.template,
          dataField: "value",
          min: am5.color(0xd3a29f),
          max: am5.color(0x6f0600),
          key: "fill",
        },
      ]);

      polygonSeries.data.setAll([
        { id: "IN", value: 40 },
        { id: "CN", value: 80 },
        { id: "US", value: 60 },
      ]);

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}: {value}",
        stroke: am5.color(0xffffff),
      });

      chart.appear(2000);
    };

    // Call all chart functions
    makeMapChart();
    makeColumnChart();
    makePieChart();
    makeRadarGauge();
    makeLineSeriesChart();

    // ✅ Cleanup on unmount
    return () => {
      am5.array.each(am5.registry.rootElements, (root) => root.dispose());
    };
  }, []);

  return (
    <div className="w-full grid grid-cols-2 gap-6 p-4">
      <div id="mapdiv" style={{ width: "100%", height: "400px" }}></div>
      <div id="columndiv" style={{ width: "100%", height: "400px" }}></div>
      <div id="piediv" style={{ width: "100%", height: "400px" }}></div>
      <div id="gaugediv" style={{ width: "100%", height: "400px" }}></div>
      <div id="linediv" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
};

export default MultiChartDashboard;
