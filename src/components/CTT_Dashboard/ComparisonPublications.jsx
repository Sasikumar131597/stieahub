// import React, { useLayoutEffect } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// const ComparisonPublications = () => {
//   useLayoutEffect(() => {
//     let root = am5.Root.new("chartdiv");

//     let myTheme = am5.Theme.new(root);
//     myTheme.rule("Grid", ["base"]).setAll({
//       strokeOpacity: 0.1,
//     });

//     root.setThemes([am5themes_Animated.new(root), myTheme]);

//     let chart = root.container.children.push(
//       am5xy.XYChart.new(root, {
//         panX: false,
//         panY: false,
//         // wheelX: "panY",
//         // wheelY: "zoomY",
//         paddingLeft: 0,
//         layout: root.verticalLayout,
//       })
//     );

//     // chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));

//     // Re-shaped data: countries as rows
//     let data = [
//       { country: "Europe", "Top 1 % Publications": 2.5, "Top 10 % Publications": 2.6, "Total Publications": 2.8 },
//       { country: "North America", "Top 1 % Publications": 2.5, "Top 10 % Publications": 2.7, "Total Publications": 2.9 },
//       { country: "Asia", "Top 1 % Publications": 2.1, "Top 10 % Publications": 2.2, "Total Publications": 2.4 },
//       { country: "Latin America", "Top 1 % Publications": 1.0, "Top 10 % Publications": 0.5, "Total Publications": 0.3 },
//       { country: "Middle East", "Top 1 % Publications": 0.8, "Top 10 % Publications": 0.4, "Total Publications": 0.9 },
//       { country: "Africa", "Top 1 % Publications": 0.4, "Top 10 % Publications": 0.3, "Total Publications": 0.5 },
//     ];

//     // Y-axis: countries
//     let yRenderer = am5xy.AxisRendererY.new(root, {});
//     let yAxis = chart.yAxes.push(
//       am5xy.CategoryAxis.new(root, {
//         categoryField: "country",
//         renderer: yRenderer,
//         tooltip: am5.Tooltip.new(root, {}),
//       })
//     );
//     yRenderer.grid.template.setAll({ location: 1 });
//     yAxis.data.setAll(data);

//     // X-axis: values
//     let xAxis = chart.xAxes.push(
//       am5xy.ValueAxis.new(root, {
//         min: 0,
//         maxPrecision: 0,
//         renderer: am5xy.AxisRendererX.new(root, {
//           minGridDistance: 40,
//           strokeOpacity: 0.1,
//         }),
//       })
//     );

//     // Legend
//     let legend = chart.children.push(
//       am5.Legend.new(root, {
//         centerX: am5.p50,
//         x: am5.p50,
//       })
//     );

//     // Function to add series (for each year)
//     function makeSeries(name, fieldName) {
//       let series = chart.series.push(
//         am5xy.ColumnSeries.new(root, {
//           name,
//           stacked: true,
//           xAxis,
//           yAxis,
//           baseAxis: yAxis,
//           valueXField: fieldName,
//           categoryYField: "country",
//         })
//       );

//       series.columns.template.setAll({
//         tooltipText: "{name}, {categoryY}: {valueX}",
//         tooltipY: am5.percent(90),
//       });

//       series.data.setAll(data);

//       series.appear();

//       series.bullets.push(() =>
//         am5.Bullet.new(root, {
//           sprite: am5.Label.new(root, {
//             text: "{valueX}",
//             fill: root.interfaceColors.get("alternativeText"),
//             centerY: am5.p50,
//             centerX: am5.p50,
//             populateText: true,
//           }),
//         })
//       );

//       legend.data.push(series);
//     }

//     // Add series for years
//     makeSeries("Top 1 % Publications", "Top 1 % Publications");
//     makeSeries("Top 10 % Publications", "Top 10 % Publications");
//     makeSeries("Total Publications", "Total Publications");

//     chart.appear(1000, 100);

//     return () => {
//       root.dispose();
//     };
//   }, []);

//   return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
// };

// export default ComparisonPublications;


import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const ComparisonPublications = () => {
  useLayoutEffect(() => {
    let root = am5.Root.new("chartdiv");

    let myTheme = am5.Theme.new(root);
    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1,
    });

    root._logo.dispose();

    root.setThemes([am5themes_Animated.new(root), myTheme]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,   // no panning
        panY: false,   // no panning
        wheelX: "none", // disable wheel actions
        wheelY: "none", // disable zoom with mouse wheel
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );

    // Data
    let data = [
      { country: "Europe", "Top 1 % Publications": 2.5, "Top 10 % Publications": 2.6, "Total Publications": 2.8 },
      { country: "North America", "Top 1 % Publications": 2.5, "Top 10 % Publications": 2.7, "Total Publications": 2.9 },
      { country: "Asia", "Top 1 % Publications": 2.1, "Top 10 % Publications": 2.2, "Total Publications": 2.4 },
      { country: "Latin America", "Top 1 % Publications": 1.0, "Top 10 % Publications": 0.5, "Total Publications": 0.3 },
      { country: "Middle East", "Top 1 % Publications": 0.8, "Top 10 % Publications": 0.4, "Total Publications": 0.9 },
      { country: "Africa", "Top 1 % Publications": 0.4, "Top 10 % Publications": 0.3, "Total Publications": 0.5 },
    ];

    // Y-axis
    let yRenderer = am5xy.AxisRendererY.new(root, {});
    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "country",
        renderer: yRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    yRenderer.grid.template.setAll({ location: 1 });
    yAxis.data.setAll(data);

    // X-axis
    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 40,
          strokeOpacity: 0.1,
        }),
      })
    );

    // Legend
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // Function to create series
    function makeSeries(name, fieldName) {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          stacked: true,
          xAxis,
          yAxis,
          baseAxis: yAxis,
          valueXField: fieldName,
          categoryYField: "country",
        })
      );

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryY}: {valueX}",
        tooltipY: am5.percent(90),
      });

      series.data.setAll(data);

      series.appear();

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueX}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        })
      );

      legend.data.push(series);
    }

    makeSeries("Top 1 % Publications", "Top 1 % Publications");
    makeSeries("Top 10 % Publications", "Top 10 % Publications");
    makeSeries("Total Publications", "Total Publications");

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default ComparisonPublications;


