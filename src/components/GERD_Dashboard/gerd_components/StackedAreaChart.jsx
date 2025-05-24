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
  const chartRef = useRef(null);

  if (!sectorGerdData || Object.keys(sectorGerdData).length === 0) {
    return <p>Loading or no data available...</p>;
  }

  // Extract data for plotting
  const years = Object.keys(sectorGerdData).sort();
  const filteredData = years
    .map((year) => ({
      year,
      publicRND: sectorGerdData[year].publicRND,
      privateRND: sectorGerdData[year].privateRND,
      heiRND: sectorGerdData[year].heiRND,
    }))
    .filter((entry) =>
      ![entry.publicRND, entry.privateRND, entry.heiRND].every((val) => val == null)
    ); // Keep entries where at least one value is non-null and non-NaN

  const filteredYears = filteredData.map((entry) => entry.year);
  const publicRND = filteredData.map((entry) => entry.publicRND ?? NaN);
  const privateRND = filteredData.map((entry) => entry.privateRND ?? NaN);
  const heiRND = filteredData.map((entry) => entry.heiRND ?? NaN);

  // Create a combined dataset and sort dynamically by the value proportions
  const data = {
    labels: filteredYears,
    datasets: [
      {
        label: "HEI R&D",
        data: heiRND,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        fill: true,
      },
      {
        label: "Private R&D",
        data: privateRND,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        fill: true,
      },

              {
        label: "Public R&D",
        data: publicRND,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: true,
      },
    ],
  };

  // Sort the datasets dynamically by their total values at each point
data.datasets.sort((a, b) => {
  const sumA = a.data.reduce((acc, curr) => acc + curr, 0);
  const sumB = b.data.reduce((acc, curr) => acc + curr, 0);
  return sumB - sumA;  // Sort in descending order (larger datasets first)
});
console.log(data.datasets)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          // Define a custom order for the legend items
          generateLabels: (chart) => {
            const originalLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            // Reorder the legend items based on dataset values
            return originalLabels.sort((a, b) => {
              if (a.text === "Public R&D") return -1;  // Public R&D first
              if (a.text === "HEI R&D") return 1;     // HEI R&D last
              return 0;  // Keep others (like Private R&D) in their original order
            });
          }
        }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;  // Show only the label of the hovered data point
          },
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()}`;  // Tooltip shows dataset label in the order: Public, Private, HEI
          }
        }
      },
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
          text: 'Years',
        },
        stacked: true, // Stacking the x-axis values
      },
      y: {
        title: {
          display: true,
          text: 'GERD Absolute Value (in INR Cr)',
        },
        stacked: true, // Stacking the y-axis values
      },
    },
  };

  const resetZoom = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.resetZoom();
    }
  };

  const downloadChart = (format) => {
    const chart = chartRef.current;
    if (chart) {
      const link = document.createElement('a');
      link.download = `chart.${format}`;
      if (format === 'png') {
        link.href = chart.toBase64Image();
      } else if (format === 'svg') {
        alert('Chart.js does not natively support SVG export.');
        return;
      }
      link.click();
    }
  };

  return (
    <div className="stacked-area-chart-container">
      <h3>Sector-Wise GERD Composition Trend</h3>

      <div className="chart-wrapper">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <p className="chart-footnote-center" >
        <b>Source: </b><span >Data on Public R&D, Central Sector R&D and State Sector R&D expenditures are from NSTMIS, Department of Science and Technology, Government of India</span>
      </p>
    </div>
  );
};

export default StackedAreaChart;