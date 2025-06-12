import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

import "./styles/piechart1.css";

const PieChart1 = ({ pieData, selectedYear }) => {
  // Define state before any early return
  const [chartState, setChartState] = useState({
    series: [],
    options: {
      chart: {
        type: "pie",
        background: "transparent",
        toolbar: {
          show: true, // Enable the toolbar
          tools: {
            download: true,  // Enable Save as Image
            zoom: true,      // Enable Zoom in/out
            zoomin: true,    // Specific Zoom-in button
            zoomout: true,   // Specific Zoom-out button
            pan: true,       // Enable panning (useful for large charts)
            reset: true,     // Home (Reset chart zoom)
          },
        },
      }, 
      labels: [],
      colors: [
        "#1E88E5", "#D81B60", "#F57C00", "#43A047", "#8E24AA", "#00ACC1",
        "#FFB300", "#C62828", "#6D4C41", "#7CB342"
      ],
      legend: {
        position: "right", 
        fontSize: "16px",  // 🔹 Increased legend font size
        labels: { colors: "#333" },
        itemMargin: {
          horizontal: 12,
          vertical: 6,
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => `INR ${val?.toFixed(2)} Cr`,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "16px",  // 🔹 Increased data label font size
          fontWeight: "bold",
        },
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 3,
          opacity: 0.5,
        },
      },
      stroke: {
        width: 3, // 🔹 Slightly thicker border
        colors: ["#fff"],
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300, // 🔹 Adjusted for small screens
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  // Ensure pieData is valid
  const processedData = pieData
    ? pieData?.map((item) => ({
        name: item?.name,
        value: item?.value === "No data available" ? 0 : parseFloat(item?.value) || 0,
      }))
    : [];

  // Calculate total value
  const total = processedData?.reduce((sum, item) => sum + item?.value, 0);

  // Update state when pieData changes

  const filteredchartdata = () => {
 
      setChartState((prevState) => ({
        ...prevState,
        series: processedData?.map((item) => item?.value),
        options: { ...prevState?.options, labels: processedData?.map((item) => item?.name) },
      }));
    
  }
  useEffect(() => {
    filteredchartdata();
  }, [pieData]);

  // Handle cases where no valid data exists
  if (!pieData || pieData?.length === 0 || total === 0) {
    return <p className="no-data">Data not available for {selectedYear}.</p>;
  }

  return (
    <div className="pie-chart-container">
      <h5>R&D Expenditure Breakdown ({selectedYear})</h5>
      {chartState?.series.length > 0 && (
        <ReactApexChart options={chartState?.options} series={chartState?.series} type="pie" width={600} />
      )}
      {/* <ReactApexChart options={chartState?.options} series={chartState?.series} type="pie" width={600} />  */}
    </div>
  );
};

export default PieChart1;
