import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const HomePublications = () => {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv-publications");
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart (NO zoom, NO scroll, NO wheel)
    let chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        innerRadius: am5.percent(20),
        startAngle: -90,
        endAngle: 180
      })
    );

    // Data
    let data = [
      { category: "Top 1 Publication", value: 80, full: 100, columnSettings: { fill: chart.get("colors").getIndex(0) } },
      { category: "Top 10 Publication", value: 35, full: 100, columnSettings: { fill: chart.get("colors").getIndex(1) } },
      { category: "Total Publication", value: 100, full: 100, columnSettings: { fill: chart.get("colors").getIndex(2) } }
    ];

    // Remove zoom cursor
    let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);
    cursor.set("behavior", "none"); // disable zoom behavior

    // X Axis
    let xRenderer = am5radar.AxisRendererCircular.new(root, {});
    xRenderer.labels.template.setAll({ radius: 10 });
    xRenderer.grid.template.setAll({ forceHidden: true });

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: xRenderer,
        min: 0,
        max: 100,
        strictMinMax: true,
        numberFormat: "#'%'",
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    // Y Axis
    let yRenderer = am5radar.AxisRendererRadial.new(root, {
      minGridDistance: 20
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: "500",
      fontSize: 18,
      templateField: "columnSettings"
    });

    yRenderer.grid.template.setAll({ forceHidden: true });

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer
      })
    );
    yAxis.data.setAll(data);

    // Background Series
    let series1 = chart.series.push(
      am5radar.RadarColumnSeries.new(root, {
        xAxis,
        yAxis,
        clustered: false,
        valueXField: "full",
        categoryYField: "category",
        fill: root.interfaceColors.get("alternativeBackground")
      })
    );

    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 0.08,
      strokeOpacity: 0,
      cornerRadius: 20
    });

    series1.data.setAll(data);

    // Value Series
    let series2 = chart.series.push(
      am5radar.RadarColumnSeries.new(root, {
        xAxis,
        yAxis,
        clustered: false,
        valueXField: "value",
        categoryYField: "category"
      })
    );

    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      tooltipText: "{category}: {valueX}%",
      cornerRadius: 20,
      templateField: "columnSettings"
    });

    series2.data.setAll(data);

    // Animations
    series1.appear(800);
    series2.appear(800);
    chart.appear(800, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div
      id="chartdiv-publications"
      style={{ width: "100%", height: "430px" }}
    ></div>
  );
};

export default HomePublications;
