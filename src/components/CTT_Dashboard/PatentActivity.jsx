import React, { useLayoutEffect, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";
import { useParams } from "react-router-dom";

const PatentActivity = () => {
  const [chartData, setChartData] = useState([]);
  const { sub_tech_id } = useParams();

  //  Helper: Add ordinal suffix to ranks
  const getOrdinalSuffix = (n) => {
    const j = n % 10,
      k = n % 100;
    if (j === 1 && k !== 11) return `${n}st`;
    if (j === 2 && k !== 12) return `${n}nd`;
    if (j === 3 && k !== 13) return `${n}rd`;
    return `${n}th`;
  };

  //  Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://development.stieahub.in/Codigniter_api/public/get_patents_country_rank/${sub_tech_id}`
        );

        //  Sort data descending by patents granted
        const sorted = res.data
          .map((item) => ({
            country: item.country_name,
            patentGranted: Number(item.patent_granted_count),
            totalApplications: Number(item.total_patent_applications),
          }))
          .sort((a, b) => b.patentGranted - a.patentGranted)
          .map((item, index) => {
            const rank = index + 1;
            return {
              ...item,
              rank,
              displayName: `${item.country}  ${getOrdinalSuffix(rank)} `, // 👈 rank after country
            };
          });

        setChartData(sorted);
      } catch (err) {
        console.error("API fetch error:", err);
      }
    };
    fetchData();
  }, [sub_tech_id]);

  //  Setup chart
  useLayoutEffect(() => {
    if (chartData.length === 0) return;

    const chartId = "patentChartDiv";

    // Dispose old charts before rendering new
    am5.array.each(am5.registry.rootElements, (root) => {
      if (root.dom.id === chartId) root.dispose();
    });

    let root = am5.Root.new(chartId);
    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    //  Main chart
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "zoomX",
        wheelY: "none",
        layout: root.verticalLayout,
      })
    );

    //  Scrollbar for zoom
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      })
    );

    //  Y-Axis with bold smaller labels
    let yRenderer = am5xy.AxisRendererY.new(root, {
      inversed: true,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minGridDistance: 20,
    });

    yRenderer.labels.template.setAll({
      fontSize: 11,
      fontWeight: "bold",
      fill: am5.color(0x333333),
    });

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "displayName", // 👈 rank after country
        renderer: yRenderer,
      })
    );
    yAxis.data.setAll(chartData);

    //  X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    );

    //  Series helper
    function createSeries(field, name, color) {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueXField: field,
          categoryYField: "displayName",
          sequencedInterpolation: true,
        })
      );

      series.columns.template.setAll({
        height: am5.p100,
        strokeOpacity: 0,
        fill: color,
        interactive: true,
        tooltipText: "[bold]{name}[/]\n{displayName}: {valueX}",
      });

      series.data.setAll(chartData);
      series.appear(1000);
      return series;
    }

    //  Create both series
    createSeries("patentGranted", "Patent Granted", am5.color(0x4e79a7));
    createSeries("totalApplications", "Patent Applications", am5.color(0xf28e2b));

    //  Legend
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        paddingTop: 10,
      })
    );
    legend.data.setAll(chart.series.values);

    //  Enable zoom + cursor
    let cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomX",
      })
    );
    cursor.lineY.set("visible", false);

    //  Animate chart
    chart.appear(1000, 100);

    //  Cleanup
    return () => {
      if (root && !root.isDisposed()) root.dispose();
    };
  }, [chartData]);

  return (
    <div
      id="patentChartDiv"
      style={{ width: "100%", height: "600px" }}
    ></div>
  );
};

export default PatentActivity;
