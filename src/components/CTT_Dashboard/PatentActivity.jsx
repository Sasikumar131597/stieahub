// import React, { useLayoutEffect, useState, useEffect } from "react";
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const PatentActivity = () => {
//   const [chartData, setChartData] = useState([]);
//   const { sub_tech_id } = useParams();

//   // ✅ Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           `https://development.stieahub.in/Codigniter_api/public/get_global_patents_country_rank/${sub_tech_id}`
//         );

//         const sorted = res.data
//           .map((item) => ({
//             country: item.country_name.trim(),
//             patentGranted: Number(item.Patent_granted),
//             totalApplications: Number(item.Patents_applied),
//           }))
//           .sort((a, b) => b.patentGranted - a.patentGranted)
//           .map((item, index) => ({
//             ...item,
//             displayName: item.country,
//           }));

//         setChartData(sorted);
//       } catch (err) {
//         console.error("API fetch error:", err);
//       }
//     };

//     fetchData();
//   }, [sub_tech_id]);

//   // ✅ Chart
//   useLayoutEffect(() => {
//     if (chartData.length === 0) return;

//     const chartId = "patentChartDiv";

//     am5.array.each(am5.registry.rootElements, (root) => {
//       if (root.dom.id === chartId) root.dispose();
//     });

//     let root = am5.Root.new(chartId);
//     root._logo.dispose();
//     root.setThemes([am5themes_Animated.new(root)]);

//     let chart = root.container.children.push(
//       am5xy.XYChart.new(root, {
//         panX: true,
//         panY: false,
//         wheelX: "zoomX",
//         layout: root.verticalLayout,
//       })
//     );

//     // ✅ Scrollbar (zoom)
//     chart.set(
//       "scrollbarX",
//       am5.Scrollbar.new(root, {
//         orientation: "horizontal",
//       })
//     );

//     // ✅ Y Axis
//     let yRenderer = am5xy.AxisRendererY.new(root, {
//       inversed: true,
//       minGridDistance: 20,
//     });

//     yRenderer.labels.template.setAll({
//       fontSize: 11,
//       fontWeight: "bold",
//     });

//     let yAxis = chart.yAxes.push(
//       am5xy.CategoryAxis.new(root, {
//         categoryField: "displayName",
//         renderer: yRenderer,
//       })
//     );

//     yAxis.data.setAll(chartData);

//     // ✅ X Axis
//     let xAxis = chart.xAxes.push(
//       am5xy.ValueAxis.new(root, {
//         min: 0,
//         renderer: am5xy.AxisRendererX.new(root, {}),
//       })
//     );

//     // ✅ Stacked Series Function
//     function createSeries(field, name, color) {
//       let series = chart.series.push(
//         am5xy.ColumnSeries.new(root, {
//           name,
//           xAxis,
//           yAxis,
//           valueXField: field,
//           categoryYField: "displayName",
//           stacked: true, //  IMPORTANT CHANGE
//         })
//       );

//       series.columns.template.setAll({
//         tooltipText: "{name}\n{categoryY}: {valueX}",
//         fill: color,
//         stroke: color,
//       });

//       series.data.setAll(chartData);
//       return series;
//     }

//     // ✅ Series (Stacked)
//     createSeries("patentGranted", "Patent Granted", am5.color(0x4e79a7));
//     createSeries("totalApplications", "Patents Applied", am5.color(0xf28e2b));

//     // ✅ Legend
//     let legend = chart.children.push(
//       am5.Legend.new(root, {
//         centerX: am5.p50,
//         x: am5.p50,
//       })
//     );
//     legend.data.setAll(chart.series.values);

//     // ✅ Cursor (zoom)
//     let cursor = chart.set(
//       "cursor",
//       am5xy.XYCursor.new(root, {
//         behavior: "zoomX",
//       })
//     );

//     cursor.lineX.set("visible", false);
//     cursor.lineY.set("visible", false);

//     chart.appear(1000, 100);

//     return () => {
//       if (root && !root.isDisposed()) root.dispose();
//     };
//   }, [chartData]);

//   return (
//     <div
//       id="patentChartDiv"
//       style={{ width: "100%", height: "600px" }}
//     ></div>
//   );
// };

// export default PatentActivity;


import React, { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";
import { useParams } from "react-router-dom";

const PatentActivity = () => {
  const chartRef = useRef(null);
  const { sub_tech_id } = useParams();

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    let root = am5.Root.new(chartRef.current);
    if (root._logo) {
        root._logo.dispose();
      }

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

    // Legend
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // X Axis
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "country",
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0.2,
          cellEndLocation: 0.8,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    // Y Axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    );

    // API CALL
    axios
      .get(
        `https://development.stieahub.in/Codigniter_api/public/get_global_patents_country_rank/${sub_tech_id}`
      )
      .then((res) => {
        let formattedData = res.data.map((item) => ({
          country: item.country_name,
          granted: Number(item.Patent_granted),
          applied: Number(item.Patents_applied),
        }));

        // 🔥 Sort descending by applied (best UX)
        formattedData.sort((a, b) => b.applied - a.applied);
        formattedData = formattedData.slice(0, 10);

        xAxis.data.setAll(formattedData);

        const createSeries = (name, field, color) => {
          let series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
              name,
              xAxis,
              yAxis,
              valueYField: field,
              categoryXField: "country",
            })
          );

          series.columns.template.setAll({
            tooltipText: "{name} ({categoryX}): {valueY}",
            width: am5.percent(70),
            fill: am5.color(color),
            stroke: am5.color(color),
            cornerRadiusTL: 6,
            cornerRadiusTR: 6,
          });

          series.data.setAll(formattedData);

          series.appear();
          legend.data.push(series);
        };

        //  Colors fixed (professional palette)
        createSeries("Patent Granted", "granted", "#2e7d32"); // dark green
        createSeries("Patent Applied", "applied", "#1565c0"); // strong blue

        chart.appear(1000, 100);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });

    return () => {
      root.dispose();
    };
  }, [sub_tech_id]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "500px" }}
    />
  );
};

export default PatentActivity;