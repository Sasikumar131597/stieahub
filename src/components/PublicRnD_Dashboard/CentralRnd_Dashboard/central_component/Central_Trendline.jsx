import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "../styles/centraltrendline.css";

const Central_Trendline = ({ chartData }) => {
  console.log("dc", chartData)
  const chartRef = useRef(null);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="central-trendline-container">
        <h3>GERD Trend Over Time</h3>
        <p>No data available.</p>
      </div>
    );
  }

  // Extracting valid years and values
  const allYears = chartData.map((item) => item.year);
  const centralSectorValues = chartData.map((item) => (item.value !== undefined ? item.value : 0));

  const minYear = allYears.length > 0 ? allYears[0] : "Unknown";
  const maxYear = allYears.length > 0 ? allYears[allYears.length - 1] : "Unknown";

  const chartOptions = {
    chart: {
      type: "line",
      animations: { easing: "easeout", speed: 800 },
      toolbar: { show: true },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    xaxis: {
      categories: allYears,
      title: {
        text: "Years",
        style: { fontSize: "16px", fontWeight: "bold" }
      },
      labels: {
        style: { fontSize: "14px" },
        rotate: 0,
        offsetY: 0,
      },
      tickAmount: Math.min(allYears.length, 10),
    },
    yaxis: {
      title: {
        text: "R&D Expenditure (INR Crore)",
        style: { fontSize: "16px", fontWeight: "bold" }
      },
      labels: { style: { fontSize: "14px" } },
    },
    grid: {
      borderColor: "#ccc",
      strokeDashArray: 5,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) => (val !== null ? `${val.toFixed(2)}` : "No data available"),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
  };

  const chartSeries = [
    {
      name: "Central Sector GERD",
      data: centralSectorValues,
      color: "#1E3A8A",
    }
  ];

  return (
    <div className="central-trendline-container">
      <h3>Central Sector Trend Over Time: ({minYear} - {maxYear})</h3>
      <div ref={chartRef}>
        {chartData.length > 0 ? (
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
        ) : (
          <p>No data available.</p>
        )}
      </div>
      <p className="chart-footnote-center">
        <b>Source: </b>
        Data on Central Sector R&D, Major Scientific Agencies R&D, and Other M/Ds R&D are from NSTMIS, Department of Science and Technology, Government of India.
      </p>
    </div>
  );
};

export default Central_Trendline;