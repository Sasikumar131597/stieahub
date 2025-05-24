import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "./styles/linechart.css";

const LineChartComponent = ({ chartData }) => {
    const chartRef = useRef(null);

    if (!chartData || chartData.length === 0) {
        return (
            <div className="line-chart-container">
                <h3>GERD Trend over Time</h3>
                <p>No data available.</p>
            </div>
        );
    }

    // Extract years and publicRND values directly
    const years = chartData.map(item => item.year);
    const values = chartData.map(item => parseFloat(item.publicRND) || null);

    const minYear = years.length > 0 ? years[0] : "Unknown";
    const maxYear = years.length > 0 ? years[years.length - 1] : "Unknown";

    const chartOptions = {
        chart: {
            type: "line",
            animations: { easing: "easeout", speed: 800 },
            toolbar: { show: true },
            margin: { bottom: 40, left: 20, right: 20 }
        },
        stroke: {
            curve: "smooth",
            width: 3,
            colors: ["#000000"],
        },
        markers: {
            size: 5,
            colors: ["#1E3A8A"],
            strokeColors: "#fff",
            strokeWidth: 2,
        },
        xaxis: {
            categories: years,
            title: {
                text: "Years",
                style: { fontSize: "16px", fontWeight: "bold", color: "#000000" }
            },
            labels: {
                style: { colors: "#000000", fontSize: "14px" },
                rotate: 0,
                offsetY: 0
            },
            tickAmount: Math.min(years.length, 10),
        },
        yaxis: {
            title: {
                text: "Public R&D (INR Crore)",
                style: { fontSize: "16px", fontWeight: "bold", color: "#000000" }
            },
            labels: { style: { colors: "#333", fontSize: "14px" } },
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
            name: "Public R&D (INR Crore)",
            data: values,
        },
    ];

    return (
        <div className="line-chart-container">
            <h3>Public R&D Trend over Time ({minYear} - {maxYear})</h3>
            <div ref={chartRef}>
                {years.length > 0 ? (
                    <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
                ) : (
                    <p>No data available.</p>
                )}
            </div>
            <p className="chart-footnote" >
                        <b>Source: </b><span >Data on Public R&D, Central Sector R&D and State Sector R&D expenditures are from NSTMIS, Department of Science and Technology, Government of India
</span>
                </p>
        </div>
    );
};

export default LineChartComponent;