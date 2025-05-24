import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Select from "react-select";
import "../styles/multilinechart_msa.css";

// Function to generate distinct colors
const generateColors = (num) => {
    return Array.from({ length: num }, (_, i) => `hsl(${(i * 137.5) % 360}, 60%, 50%)`);
};

const MultilineChart_MD = ({ apiData }) => {
    const defaultMinistries = ["Defence Production", "Petroleum and Natural Gas", "Mines"];
    const [selectedMinistries, setSelectedMinistries] = useState(defaultMinistries);
    const [formattedData, setFormattedData] = useState({ years: [], departments: {} });

    useEffect(() => {
        if (!apiData || !apiData.years || !apiData.departments) {
            return;
        }

        try {
            const years = apiData.years;
            const departments = apiData.departments;

            let formatted = {};
            Object.keys(departments)
                .filter((department) => department !== "Total")
                .forEach((department) => {
                    const values = departments[department].map((val) =>
                        val === "-" || val === "" || val === null ? 0 : parseFloat(val) || 0
                    );
                    formatted[department] = values;
                });

            setFormattedData({ years, departments: formatted });

            // Ensure the default ministries exist before setting them
            const validDefaults = defaultMinistries.filter((department) => departments[department]);
            setSelectedMinistries(validDefaults);
        } catch (error) {
            console.error("Error processing API data:", error);
        }
    }, [apiData]);

    const ministryOptions = Object.keys(formattedData.departments || {}).map((department) => ({
        value: department,
        label: department,
    }));

    const selectedOptions = ministryOptions.filter((option) =>
        selectedMinistries.includes(option.value)
    );

    // Generate a color array based on the number of ministries
    const colors = generateColors(selectedMinistries.length);

    const chartData = {
        series: selectedMinistries.map((department, index) => ({
            name: department,
            data: formattedData.departments[department] || [],
            color: colors[index], // Assign unique colors
        })),
        options: {
            chart: {
                type: "line",
                height: 400,
                background: "#fff",
                toolbar: { show: true },
            },
            xaxis: {
                categories: formattedData.years || [],
                title: {
                    text: "Years",
                    style: { fontSize: "14px" },
                    show: true,
                },
            },
            yaxis: {
                title: { text: "R&D Expenditure (in INR Cr.)" },
            },
            stroke: {
                curve: "smooth",
                width: 2,
            },
            markers: {
                size: 4,
            },
            tooltip: {
                shared: true,
                intersect: false,
            },
            colors: colors, // Apply generated colors here
            legend: {
                show: true,
                showForSingleSeries: true,
                position: "bottom",
                horizontalAlign: "center",
                floating: false,
                offsetY: 20,
                offsetX: 30,
            },
            grid: {
                padding: {
                    left: 20,
                    right: 20,
                },
            },
        },
    };

    return (
        <div className="multilinechart_md_container">
            <br />
            <br />
            <h3 className="section-title">Ministries & Departments R&D Trends</h3>
            <br />
            <Select
                options={ministryOptions}
                isMulti
                value={selectedOptions}
                onChange={(selectedOptions) =>
                    setSelectedMinistries(selectedOptions.map((option) => option.value))
                }
                placeholder="Select Ministries..."
                className="multilinechart_md_multiselect"
            />
            <div className="chart-container">
                {selectedMinistries.length > 0 ? (
                    <Chart options={chartData.options} series={chartData.series} type="line" height={500} width={1200} />
                ) : (
                    <p>Select a ministry to visualize data</p>
                )}
                <p className="chart-footnote-center">
                    <b>Source: </b>
                    <span>
                        Data on each Major Scientific Agency R&D and Other M/Ds R&D are from NSTMIS, Department of Science and Technology, Government of India.
                    </span>
                </p>
            </div>
        </div>
    );
};

export default MultilineChart_MD;