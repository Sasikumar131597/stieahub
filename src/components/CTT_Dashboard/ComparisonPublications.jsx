import React, { useLayoutEffect, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";
import { useParams } from "react-router-dom";

const ComparisonPublications = () => {
  const [chartData, setChartData] = useState([]);
  const { sub_tech_id } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(
          `https://development.stieahub.in/Codigniter_api/public/get_publication_country_rank/${sub_tech_id}`
        );

        // Sort descending by total publications
        const sorted = res.data.sort(
          (a, b) =>
            Number(b.total_publication_count) - Number(a.total_publication_count)
        );

        // Helper: get ordinal suffix
        const getOrdinal = (n) => {
          const s = ["th", "st", "nd", "rd"];
          const v = n % 100;
          return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        // Format country names like "USA (1st)"
        const formatted = sorted.map((item, index) => ({
          country: `${item.country_name}  ${getOrdinal(index + 1)} `,
          top1: Number(item.top_1_publication_count),
          top10: Number(item.top_10_publication_count),
          total: Number(item.total_publication_count),
        }));

        setChartData(formatted);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    loadData();
  }, [sub_tech_id]);

  useLayoutEffect(() => {
    if (chartData.length === 0) return;

    let root = am5.Root.new("publicationChartDiv");

    root._logo.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout,
      })
    );

    let yRenderer = am5xy.AxisRendererY.new(root, {
      inversed: true,
      minGridDistance: 20,
    });

    yRenderer.labels.template.setAll({
      fontSize: 11,
      fontWeight: "bold",
      fill: am5.color(0x555555),
    });

    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "country",
        renderer: yRenderer,
      })
    );

    yAxis.data.setAll(chartData);

    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        maxPrecision: 0,
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    function makeSeries(seriesName, valueField, color) {
  let series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: seriesName,
      stacked: true,
      valueXField: valueField,
      categoryYField: "country",
      xAxis,
      yAxis,
    })
  );

  series.columns.template.setAll({
    tooltipText: "{name}\n{categoryY}: {valueX}",
    fill: am5.color(color),
    stroke: am5.color(color),
    width: am5.percent(90)
  });

  series.data.setAll(chartData);
  legend.data.push(series);
}

  makeSeries("Top 1 % Publications", "top1", 0x0d47a1);   
  makeSeries("Top 10 % Publications", "top10", 0x42a5f5); 
  makeSeries("Total Publications", "total", 0x00897b);    


    return () => root.dispose();
  }, [chartData]);

  return (
    <div
      id="publicationChartDiv"
      style={{ width: "100%", height: "500px" }}
    ></div>
  );
};

export default ComparisonPublications;
