// import React, { useLayoutEffect, useRef } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import * as am5radar from "@amcharts/amcharts5/radar";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// const PatentActivity = () => {
//   const chartRef = useRef(null); // useRef instead of id

//   useLayoutEffect(() => {
//     // Clean up any old root on this container
//     if (chartRef.current) {
//       let root = am5.Root.new(chartRef.current);

//       root.setThemes([am5themes_Animated.new(root)]);

//       // Data
//       let data = [
//         { category: "One", value1: 8, value2: 2 },
//         { category: "Two", value1: 11, value2: 4 },
//         { category: "Three", value1: 7, value2: 6 },
//         { category: "Four", value1: 13, value2: 8 },
//         { category: "Five", value1: 12, value2: 10 },
//         { category: "Six", value1: 15, value2: 12 },
//         { category: "Seven", value1: 9, value2: 14 },
//         { category: "Eight", value1: 6, value2: 16 },
//       ];

//       // Chart
//       let chart = root.container.children.push(
//         am5radar.RadarChart.new(root, {
//           panX: false,
//           panY: false,
//         //   wheelX: "panX",
//         //   wheelY: "zoomX",
//         })
//       );

//     //   let cursor = chart.set(
//     //     "cursor",
//     //     am5radar.RadarCursor.new(root, { behavior: "zoomX" })
//     //   );
//     //   cursor.lineY.set("visible", false);

//       // Axes
//       let xRenderer = am5radar.AxisRendererCircular.new(root, {
//         cellStartLocation: 0.2,
//         cellEndLocation: 0.8,
//       });
//       xRenderer.labels.template.setAll({ radius: 10 });

//       let xAxis = chart.xAxes.push(
//         am5xy.CategoryAxis.new(root, {
//           maxDeviation: 0,
//           categoryField: "category",
//           renderer: xRenderer,
//           tooltip: am5.Tooltip.new(root, {}),
//         })
//       );
//       xAxis.data.setAll(data);

//       let yAxis = chart.yAxes.push(
//         am5xy.ValueAxis.new(root, {
//           renderer: am5radar.AxisRendererRadial.new(root, {}),
//         })
//       );

//       // Series
//       for (let i = 1; i <= 2; i++) {
//         let series = chart.series.push(
//           am5radar.RadarColumnSeries.new(root, {
//             name: "Series " + i,
//             xAxis,
//             yAxis,
//             valueYField: "value" + i,
//             categoryXField: "category",
//           })
//         );

//         series.columns.template.setAll({
//           tooltipText: "{name}: {valueY}",
//           width: am5.percent(100),
//         });

//         series.data.setAll(data);
//         series.appear(1000);
//       }

//       // Scrollbars
//     //   chart.set(
//     //     "scrollbarX",
//     //     am5.Scrollbar.new(root, { orientation: "horizontal", exportable: false })
//     //   );
//     //   chart.set(
//     //     "scrollbarY",
//     //     am5.Scrollbar.new(root, { orientation: "vertical", exportable: false })
//     //   );

//       chart.appear(1000, 100);

//       return () => {
//         root.dispose(); // Cleanup to avoid multiple roots
//       };
//     }
//   }, []);

//   return <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>;
// };

// export default PatentActivity;

import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const PatentActivity = () => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (chartRef.current) {
      let root = am5.Root.new(chartRef.current);

      // 🚀 Remove watermark
      root._logo.dispose();

      root.setThemes([am5themes_Animated.new(root)]);

      // Data
      let data = [
        { category: "One", value1: 8, value2: 2 },
        { category: "Two", value1: 11, value2: 4 },
        { category: "Three", value1: 7, value2: 6 },
        { category: "Four", value1: 13, value2: 8 },
        { category: "Five", value1: 12, value2: 10 },
        { category: "Six", value1: 15, value2: 12 },
        { category: "Seven", value1: 9, value2: 14 },
        { category: "Eight", value1: 6, value2: 16 },
      ];

      // Chart
      let chart = root.container.children.push(
        am5radar.RadarChart.new(root, {
          panX: false,
          panY: false,
        })
      );

      // Axes
      let xRenderer = am5radar.AxisRendererCircular.new(root, {
        cellStartLocation: 0.2,
        cellEndLocation: 0.8,
      });
      xRenderer.labels.template.setAll({ radius: 10 });

      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0,
          categoryField: "category",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {}),
        })
      );
      xAxis.data.setAll(data);

      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5radar.AxisRendererRadial.new(root, {}),
        })
      );

      // Legend
      let legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
          marginTop: 20,
        })
      );

      // Series
      const seriesNames = ["Patents Granted", "Patent Applications"];

      seriesNames.forEach((name, index) => {
        let series = chart.series.push(
          am5radar.RadarColumnSeries.new(root, {
            name: name,
            xAxis,
            yAxis,
            valueYField: "value" + (index + 1),
            categoryXField: "category",
          })
        );

        series.columns.template.setAll({
          tooltipText: "{name}: {valueY}",
          width: am5.percent(100),
        });

        series.data.setAll(data);
        series.appear(1000);

        legend.data.push(series);
      });

      chart.appear(1000, 100);

      return () => {
        root.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "500px" }}></div>;
};

export default PatentActivity;


