import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const CountrySectorProportion = ({ chartData }) => {

    if (!chartData || chartData.length === 0) {
        return <p>Loading Chart Data...</p>;
    }

    // Extract categories (countries) and series data
    const categories = chartData.map((item) => item.country);

    const series = [
        {
            name: "Business",
            data: chartData.map((item) => item.Business),
        },
        {
            name: "Government",
            data: chartData.map((item) => item.Government),
        },
        {
            name: "Higher Education",
            data: chartData.map((item) => item.HigherEducation || 0), // Default to 0 if missing
        },
        {
            name: "Private Non-Profit",
            data: chartData.map((item) => item.PrivateNonProfit || 0),
        },
    ];

    const options = {
        chart: {
            type: "bar",
            height: 500,
            background: "transparent",
            toolbar: {
                show: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "100%",
            },
        },
        xaxis: {
            categories,
            labels: {
                rotate: -45,
                style: { fontSize: "12px" },
            },
            title: {
                text: "Countries",
                style: { fontSize: "14px", fontWeight: "bold" },
            },
        },
        yaxis: {
            title: {
                text: "GERD Proportion (%)",
                style: { fontSize: "14px", fontWeight: "bold" },
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `${val}%`,
            },
        },
        legend: {
            position: "bottom",
        },
        colors: ["#4c78a8", "#72b75c", "#b07aa1", "#f58518"], // Same colors as before
        responsive: [
            {
                breakpoint: 768,
                options: {
                    chart: {
                        width: "100%",
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: "60%",
                        },
                    },
                },
            },
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: "100%",
                    },
                    xaxis: {
                        labels: {
                            rotate: -90,
                            style: { fontSize: "10px" },
                        },
                    },
                },
            },
        ],
    };

    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
                 GERD Sectoral Composition (2021)</h2>
            <Chart options={options} series={series} type="bar" height={500} width="100%" />
        </div>
    );
};

export default CountrySectorProportion;