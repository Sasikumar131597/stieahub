import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const SinglePieChart = () => {
  useLayoutEffect(() => {
    // Root
    const root = am5.Root.new("singlePieDiv");
    root.setThemes([am5themes_Animated.new(root)]);

    // Chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270,
        innerRadius: am5.percent(60),
      })
    );

    // Series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270,
        alignLabels: false,
      })
    );

    // Center Label
    series.children.push(
      am5.Label.new(root, {
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        text: "Total: {valueSum}",
        populateText: true,
        fontSize: "1.5em",
      })
    );

    // Slice styles
    series.slices.template.setAll({
      cornerRadius: 8,
      tooltipText: "{category}: {value}",
    });

    series.labels.template.setAll({
      textType: "circular",
    });

    series.states.create("hidden", { endAngle: -90 });

    // Data
    series.data.setAll([
      { category: "Lithuania", value: 501 },
      { category: "Czechia", value: 301 },
      { category: "Ireland", value: 201 },
      { category: "Germany", value: 165 },
    ]);

    // Animate
    series.appear(1000, 100);

    return () => root.dispose();
  }, []);

  return (
    <div
      id="singlePieDiv"
      style={{
        width: "100%",
        height: "500px",
      }}
    ></div>
  );
};

export default SinglePieChart;
