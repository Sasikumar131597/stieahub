import React, { useLayoutEffect, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from "axios";
import { useParams } from "react-router-dom";

const ComparisonPublications = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { sub_tech_id } = useParams();

  //  Fetch Data from API
  useEffect(() => {
    const loadData = async () => {
      if (!sub_tech_id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await axios.get(
          `https://development.stieahub.in/Codigniter_api/public/get_global_publication_country_rank/${sub_tech_id}`
        );

        const sorted = res.data.sort(
          (a, b) =>
            Number(b.total_publication_count) -
            Number(a.total_publication_count)
        );

        const formatted = sorted.map((item) => ({
          country: item.country_name.trim(),
          total: Number(item.total_publication_count),
          top10: Number(item.top_10_publication_count),
          top1: Number(item.top_1_publication_count),
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load publication data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sub_tech_id]);

  // ✅ Chart Initialization
  useLayoutEffect(() => {
    if (chartData.length === 0 || loading) return;

    let root = am5.Root.new("publicationChartDiv");
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    // Create Chart Container - 🔴 Zoom disabled
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",    //  Disabled mouse wheel zoom X
        wheelY: "none",    //  Disabled mouse wheel zoom Y
        paddingLeft: 0,
        layout: root.verticalLayout,
      })
    );

    //  Y-Axis (Categories - Countries) -  Increased bar thickness
    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "country",
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: true,
          cellStartLocation: 0.02,  //  Bars occupy 96% of vertical cell
          cellEndLocation: 0.98,
          minorGridEnabled: true,
        }),
      })
    );
    yAxis.data.setAll(chartData);

    //  X-Axis (Values - Publication Counts)
    let xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minGridDistance: 50,
        }),
        min: 0,
        maxPrecision: 0,
      })
    );

    //  Legend (Centered at Top)
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 10,
        marginBottom: 10,
      })
    );

    //  Series Creator Function
    function createSeries(field, name, color, indiaColor) {
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: field,
          categoryYField: "country",
          sequencedInterpolation: true,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n{categoryY}: {valueX}",
          }),
        })
      );

      //  Column styling - Thicker bars with correct percent syntax
      series.columns.template.setAll({
        height: am5.p100,
        width: am5.percent(95),     //  Fixed: use am5.percent() for custom values
        strokeOpacity: 0,
        tooltipText: "{name}\n{categoryY}: {valueX}",
      });

      //  India-specific coloring
      series.columns.template.adapters.add("fill", (fill, target) => {
        const dataItem = target.dataItem;
        if (dataItem?.dataContext?.country === "India" && indiaColor) {
          return am5.color(indiaColor);
        }
        return am5.color(color);
      });

      //  Data Labels on Bars
      series.bullets.push(() => {
        return am5.Bullet.new(root, {
          locationX: 1,
          locationY: 0.5,
          sprite: am5.Label.new(root, {
            centerY: am5.p50,
            text: "{valueX}",
            populateText: true,
            fontSize: 11,
            fill: am5.color(0x333333),
            paddingLeft: 5,
          }),
        });
      });

      series.data.setAll(chartData);
      series.appear(1000, 100);

      return series;
    }

    //  Create Three Series (Grouped Bars)
    createSeries("total", "Total Publications", 0x00897b, 0xFFB266);
    createSeries("top10", "Top 10% Publications", 0x42a5f5, 0xFF9933);
    createSeries("top1", "Top 1% Publications", 0x0d47a1, 0xCC6600);

    //  Connect Legend to Series
    legend.data.setAll(chart.series.values);

    //  Zoom completely disabled - no cursor added

    //  Animate Chart on Load
    chart.appear(1000, 100);

    //  Cleanup on Unmount
    return () => {
      root.dispose();
    };
  }, [chartData, loading]);

  //  Loading & Error States
  if (loading) {
    return (
      <div className="chart-container" style={{ width: "100%", height: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading publication data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container" style={{ width: "100%", height: "600px", display: "flex", alignItems: "center", justifyContent: "center", color: "#d32f2f" }}>
        <p>{error}</p>
      </div>
    );
  }

  //  Main Render
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div 
        id="publicationChartDiv" 
        style={{ width: "100%", height: "100%" }}
        aria-label="Publication comparison chart by country"
      />
    </div>
  );
};

export default ComparisonPublications;