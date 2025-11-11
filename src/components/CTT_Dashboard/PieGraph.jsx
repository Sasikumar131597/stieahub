import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";

function PieGraph({ chartData = [] }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartData.length) return; 

    const gradientColors = chartData.map((data, idx) => {
      const userColor =
        data.color ||
        Highcharts.getOptions().colors[idx % Highcharts.getOptions().colors.length];
      return {
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
        stops: [
          [0, userColor],
          [1, Highcharts.color(userColor).brighten(-0.3).get("rgb")],
        ],
      };
    });

    // Create chart
    const chart = Highcharts.chart(chartRef.current, {
      chart: {
        type: "pie",
        height: 180,
        backgroundColor: "transparent",
      },
      title: { text: undefined },
      tooltip: {
        pointFormat: "<b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: { valueSuffix: "%" },
      },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.percentage:.1f}%",
            distance: -30,
            style: {
              fontSize: "13px",
              fontWeight: "bold",
              color: "white",
              textOutline: "1px contrast",
            },
          },
        },
      },
      series: [
        {
          name: "Share",
          colorByPoint: false,
          data: chartData.map((item, idx) => ({
            name: item.name,
            y: Number(item.value),
            color: gradientColors[idx],
          })),
        },
      ],
    });

    return () => {
      if (chart) chart.destroy();
    };
  }, [chartData]);

  return <div ref={chartRef} style={{ width: "100%", height: 200 }} />;
}

export default PieGraph;


