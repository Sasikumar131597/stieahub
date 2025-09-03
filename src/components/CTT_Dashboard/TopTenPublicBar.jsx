import React, { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const TopTenPublicBar = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const root = am5.Root.new(chartRef.current);

    // 🚀 Remove amCharts watermark
    root._logo.dispose();

    // Custom theme to lighten grid
    let myTheme = am5.Theme.new(root);
    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1,
    });

    root.setThemes([am5themes_Animated.new(root), myTheme]);

    // Chart container
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
      })
    );

    // Y Axis (categories)
    const yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true,
    });
    yRenderer.grid.template.set("location", 1);

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "country",
        renderer: yRenderer,
      })
    );

    // X Axis (values)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          visible: true,
          strokeOpacity: 0.1,
          minGridDistance: 80,
        }),
      })
    );

    // Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "value",
        sequencedInterpolation: true,
        categoryYField: "country",
      })
    );

    let columnTemplate = series.columns.template;
    columnTemplate.setAll({
      cursorOverStyle: "pointer",
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      strokeOpacity: 0,
      tooltipText: "{categoryY}: {valueX}",
    });

    columnTemplate.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    columnTemplate.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    // Sample Data
    const data = [
      { country: "USA", value: 2025 },
      { country: "China", value: 1882 },
      { country: "Japan", value: 1809 },
      { country: "Germany", value: 1322 },
      { country: "UK", value: 1122 },
    ];

    yAxis.data.setAll(data);
    series.data.setAll(data);

    // Animations
    series.appear(1000);
    chart.appear(1000, 100);

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

export default TopTenPublicBar;
