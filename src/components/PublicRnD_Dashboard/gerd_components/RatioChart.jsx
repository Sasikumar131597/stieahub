import React, { useState } from "react";
import Chart from "react-apexcharts";
import "./styles/ratiochart.css";

const RatioChart = ({ ratioData }) => {

  const [selectedRatio, setSelectedRatio] = useState("public");

  if (!ratioData || ratioData.length === 0) {
    return <p>Loading Ratio Data...</p>;
  }

  // Process data based on the selected category
  const validData = ratioData
    .map(entry => {
      const categoryData = entry[selectedRatio]; // "public", "central", "state"
      if (!categoryData || categoryData.ratio === null || categoryData.type === "Unknown") return null;

      return {
        year: entry.year,
        ratio: categoryData.ratio,
        type: categoryData.type // "GDP" or "GNP"
      };
    });

  const years = ratioData.map(entry => entry.year); // Keep all years even if they have missing data
  const gdpValues = validData.map(entry => (entry?.type === "GDP" ? entry.ratio : null));
  const gnpValues = validData.map(entry => (entry?.type === "GNP" ? entry.ratio : null));

  const colors = {
    GDP: "#1E88E5", // Blue for GDP
    GNP: "#43A047", // Green for GNP
  };

  const series = [
    {
      name: "GDP",
      data: years.map((year, index) => gdpValues[index] !== null ? { x: year, y: gdpValues[index] } : { x: year, y: null }),
      color: colors.GDP,
    },
    {
      name: "GNP",
      data: years.map((year, index) => gnpValues[index] !== null ? { x: year, y: gnpValues[index] } : { x: year, y: null }),
      color: colors.GNP,
    }
  ];

  const options = {
    chart: {
      type: "line",
      height: 400,
      zoom: { enabled: true },
    },
    stroke: {
      width: [3, 3],
      dashArray: [0, 0], // Ensures continuous lines only for existing data
    },
    markers: {
      size: [5, 5],
      colors: [colors.GDP, colors.GNP],
      strokeWidth: 2,
      hover: { size: 7 },
    },
    xaxis: {
      categories: years,
      title: { text: "Years", style: { fontSize: "14px", fontWeight: "bold" } },
      labels: { style: { colors: "#333", fontSize: "12px" }, rotate: -45 },
      tickAmount: Math.min(years.length, 10),
    },
    yaxis: {
      title: {
        text: `${selectedRatio.charAt(0).toUpperCase() + selectedRatio.slice(1)} R&D Intensity (in %)`,
        style: { fontSize: "14px", fontWeight: "bold" }
      },
      labels: { style: { colors: "#333", fontSize: "12px" } },
    },
    tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const value = w.globals.series[seriesIndex][dataPointIndex];

            if (value === null || value === undefined || isNaN(value)) {
                return `<div style="display: flex; align-items: center;">
                          <span style="width: 10px; height: 10px; background-color: ${w.globals.colors[seriesIndex]}; border-radius: 50%; margin-right: 5px;"></span>
                          <b>R&D Intensity: </b> No Data
                        </div>`;
            }

            return `<div style="display: flex; align-items: center;">
                      <span style="width: 10px; height: 10px; background-color: ${w.globals.colors[seriesIndex]}; border-radius: 50%; margin-right: 5px;"></span>
                      <b>R&D Intensity: </b> ${value.toFixed(3)}%
                    </div>`;
        },
    },
    colors: [colors.GDP, colors.GNP],
legend: {
  show: true,
  position: "bottom",
  horizontalAlign: "center",
  itemMargin: {
    horizontal: 10, // Reduce spacing between GDP and GNP
    vertical: 5,
  },
  markers: {
    width: 10,
    height: 10,
    fillColors: [colors.GDP, colors.GNP],
    strokeWidth: 0,
    radius: 50, // Make it circular
  },
  labels: {
    colors: ["#000000"],
    useSeriesColors: false,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
    },
  },
},
  };

  return (
    <div className="ratiochart-container">
      <div className="select-container">
        <label htmlFor="ratio-select">Select a Ratio</label>
        <div className="select-wrapper">
          <select id="ratio-select" onChange={(e) => setSelectedRatio(e.target.value)} value={selectedRatio}>
            <option value="public">Public R&D Intensity</option>
            <option value="central">Central R&D Intensity</option>
            <option value="state">State R&D Intensity</option>
          </select>
        </div>
      </div>
      <div className="ratiochart">
        <Chart options={options} series={series} type="line" height={400} />
      </div>
      <p className="chart-footnote" >
        <b>Source: </b><span >Data on Public R&D, Central Sector R&D, State Sector R&D expenditures and GDP/GNP are from NSTMIS, Department of Science and Technology, Government of India. Data on GDP from NSTMIS compiled from Economic Survey of India reports. For the years upto 1989-90, Gross National Product (GNP) had been used as denominator in place of Gross Domestic Product (GDP)</span>
      </p>
    </div>
  );
};

export default RatioChart;