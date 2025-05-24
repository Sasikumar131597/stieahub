import React, { useState } from "react";
import Chart from "react-apexcharts";
import "./styles/ratiochart.css";
// import { Dropdown } from 'primereact/dropdown';


const RatioChart = ({ ratioData }) => {
  const [selectedRatio, setSelectedRatio] = useState("gerdRatio");

  if (!ratioData || Object.keys(ratioData).length === 0) {
    return <p>Loading Ratio Data...</p>;
  }

  const years = Object.keys(ratioData).sort();

  const ratioMapping = {
    gerdRatio: { label: "R&D Intensity", key: "gerdRatio", typeKey: "gerdRatioType" },
    publicRDRatio: { label: "Public R&D Intensity", key: "publicRDRatio", typeKey: "publicRDRatioType" },
    privateRDRatio: { label: "Private R&D Intensity", key: "privateRDRatio", typeKey: "privateRDRatioType" },
    heiRDRatio: { label: "HEI R&D Intensity", key: "heiRDRatio", typeKey: "heiRDRatioType" },
  };

  const selectedKey = ratioMapping[selectedRatio].key;
  const selectedTypeKey = ratioMapping[selectedRatio].typeKey;

  const ratioValues = years.map((year) =>
    ratioData[year]?.[selectedKey] !== "No data available" ? ratioData[year]?.[selectedKey] : null
  );

  const ratioTypes = years.map((year) =>
    ratioData[year]?.[selectedTypeKey] !== "No data available" ? ratioData[year]?.[selectedTypeKey] : null
  );

  const colors = {
    GDP: "#1E88E5",
    GNP: "#43A047",
    // NoData: "#FF9800",
  };

  const series = [
    {
      name: "GDP",
      data: years.map((year, index) => (ratioTypes[index] === "GDP" ? ratioValues[index] : null)),
      color: colors.GDP,
    },
    {
      name: "GNP",
      data: years.map((year, index) => (ratioTypes[index] === "GNP" ? ratioValues[index] : null)),
      color: colors.GNP,
    },
  ];

const yAxisLabels = {
  gerdRatio: "R&D Intensity (in %)",
  publicRDRatio: "Public R&D Intensity (in %)",
  privateRDRatio: "private R&D Intensity (in %)",
  heiRDRatio: "HEI R&D Intensity (in %)",
};

const options = {
  chart: {
    type: "line",
    height: 400,
    zoom: { enabled: true },
  },
  stroke: {
    width: [3, 3, 2], // Line thickness
    dashArray: [0, 0, 5], // Dashed line for missing data
  },
  markers: {
    size: [5, 5, 0], // Hide markers for missing data
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
      text: yAxisLabels[selectedRatio] || "R&D Intensity (in %)", // Dynamic label
      style: { fontSize: "14px", fontWeight: "bold" }
    },
    labels: { style: { colors: "#333", fontSize: "12px" } },
  },
  tooltip: {
    enabled: true,
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const seriesNames = ["GDP", "GNP"];
      const values = seriesNames
        .map((name, idx) => {
          const value = w.globals.series[idx][dataPointIndex];
          return value !== null && value !== undefined
            ? `<div style="display: flex; align-items: center;">
                 <span style="width: 10px; height: 10px; background-color: ${w.globals.colors[idx]}; border-radius: 50%; margin-right: 5px;"></span>
                 <b>${name}: </b> ${value.toFixed(3)}%
               </div>`
            : "";
        })
        .filter(Boolean)
        .join("");

      return values ? `<div class="custom-tooltip">${values}</div>` : "";
    },
  },
  colors: [colors.GDP, colors.GNP],
  legend: {
    show: true,
    position: "bottom",
    offsetY: 13, // Adjust this value to move the legend lower
    offsetX: 40,
    markers: {
      fillColors: [colors.GDP, colors.GNP, "transparent"],
      strokeWidth: [0, 0, 2],
      radius: [5, 5, 0],
    },
    labels: {
      colors: ["#000000"],
      useSeriesColors: false,
    },
  }
  
};
  return (
    <div className="ratiochart-container">
      <div className="select-container">
          <label htmlFor="ratio-select">Select a Ratio</label>
          <div className="select-wrapper">
              <select id="ratio-select" onChange={(e) => setSelectedRatio(e.target.value)} value={selectedRatio}>
                  {Object.keys(ratioMapping).map((key) => (
                      <option key={key} value={key}>{ratioMapping[key].label}</option>
                  ))}
              </select>
          </div>
      </div>
      <div className="ratiochart">
        <Chart options={options} series={series} type="line" height={400} />
      </div>
      <p className="chart-footnote" >
        <b>Source: </b><span >Data on GERD and GDP/GNP are from NSTMIS, Department of Science and Technology, Government of India. Data on GDP from NSTMIS compiled from Economic Survey of India reports. For the years upto 1989-90, Gross National Product (GNP) had been used as denominator in place of Gross Domestic Product (GDP)</span>
      </p>
    </div>
  );
};

export default RatioChart;