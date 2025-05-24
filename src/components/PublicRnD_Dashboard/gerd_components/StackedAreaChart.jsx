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
import zoomPlugin from 'chartjs-plugin-zoom';
import "./styles/stackedareachart.css";

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

const StackedAreaChart = ({ sectorGerdData }) => {
  console.log(sectorGerdData);
  const chartRef = useRef(null);

  if (!sectorGerdData || sectorGerdData.length === 0) {
    return <p>Loading or no data available...</p>;
  }

  // Extract years, central and state data
  const years = sectorGerdData.map(entry => entry.year);
  const centralValues = sectorGerdData.map(entry => entry.central || NaN);
  const stateValues = sectorGerdData.map(entry => entry.state || NaN);

  const data = {
    labels: years,
    datasets: [
        {
        label: "State Sector R&D",
        data: stateValues,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        fill: true,
      },
      {
        label: "Central Sector R&D",
        data: centralValues,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: true,
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
        pan: { enabled: true, mode: "x" },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" }
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Years' },
        stacked: true
      },
      y: {
        title: { display: true, text: 'Public R&D Expenditure Absolute Value (in INR Cr)' },
        stacked: true
      },
    },
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div className="stacked-area-chart-container">
      <h3>Public R&D Composition Trend</h3>
      <div className="chart-wrapper">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <p className="chart-footnote" >
                        <b>Source: </b><span >Data on Public R&D, Central Sector R&D and State Sector R&D expenditures are from NSTMIS, Department of Science and Technology, Government of India
</span>
                </p>
    </div>
  );
};

export default StackedAreaChart;