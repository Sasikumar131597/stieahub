import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "../styles/centralstackedareachart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

const Central_StackedAreaChart = ({ chartData }) => {
  console.log(chartData,"sd")
  const chartRef = useRef(null);

  if (!chartData || chartData.length === 0) {
    return <p>No data available.</p>;
  }

  // Extract years and values
  const years = chartData.map((item) => item.year);
  const msaValues = chartData.map((item) =>
    item.MSA_RND !== null && item.MSA_RND !== undefined ? item.MSA_RND : null
  );

  const mdValues = chartData.map((item) =>
    item.MD_RND !== null && item.MD_RND !== undefined ? item.MD_RND : null
  );

  const data = {
    labels: years,
    datasets: [
        {
        label: "Ministry/Department (MD)",
        data: mdValues,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        fill: true, // Enables stacked area effect
        tension: 0, // Smoothes the curve
      },
      {
        label: "Major Scientific Agencies (MSA)",
        data: msaValues,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: true, // Enables stacked area effect
        tension: 0, // Smoothes the curve
      },

    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Years",
        },
      },
      y: {
        title: {
          display: true,
          text: "R&D Expenditure (in INR Cr)",
        },
        stacked: true, // Ensures proper stacking
      },
    },
  };

  const resetZoom = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.resetZoom();
    }
  };

  return (
    <div className="central-stacked-area-chart-container">
      <h3 className="chart-title">Central Sector R&D Composition Trend</h3>
      <div className="chart-wrapper">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <p className="chart-footnote-center">
        <b>Source: </b>
        <span>
          Data on Major Scientific Agencies and Ministry/Department R&D expenditures are from NSTMIS, Department of Science and Technology, Government of India.
        </span>
      </p>
    </div>

  );
};

export default Central_StackedAreaChart;