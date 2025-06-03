import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import Chart from "react-apexcharts";
import "../styles/msagerdabsvalue.css";

const MSAgerdabsvalue = ({ msaData }) => {
    const [yearIndex, setYearIndex] = useState(0);

    if (!msaData || !msaData.years || !msaData.agencies) {
        return <p>Loading data...</p>;
    }

    const years = [...msaData.years];
    const agencies = Object.keys(msaData.agencies);
    const selectedYear = years[yearIndex];

    const yearData = agencies.map(agency => ({
        x: agency,
        y: msaData.agencies[agency][yearIndex] || 0
    }));

    // Function to generate dynamic colors
    const generateColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 137.5) % 360; // Ensures good color separation
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }
        return colors;
    };

    // Assign colors dynamically
    const colors = generateColors(agencies.length);

    const chartData = {
        series: [
            {
                name: "Major Scientific Agencies Absolute Value (in INR Cr.)",
                data: yearData
            }
        ],
        options: {
            chart: {
                type: "bar",
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    }
                }
            },
            plotOptions: {
                bar: {
                    distributed: true, // Enables different colors for each bar
                    dataLabels: {
                        position: "top",
                    }
                }
            },
            colors: colors, // Assign dynamically generated colors
            dataLabels: {
                enabled: true,
                formatter: (val) => val.toLocaleString(),
                offsetY: -20,
                style: {
                    fontSize: "12px",
                    colors: ["#304758"]
                }
            },
            tooltip: {
                enabled: true
            },
            xaxis: {
                categories: agencies,
                labels: {
                    rotate: -45,
                    style: { fontSize: "12px" }
                }
            },
            yaxis: {
                title: {
                    text: "Major Scientific Agencies Absolute Value (in INR Cr.)"
                }
            }
        }
    };

    const handleYearChange = (event, newValue) => {
        setYearIndex(newValue);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", margin: "auto", width: "1200px" }}>
            <br />
            <br />
            <h3 className="section-title">Major Scientific Agencies Absolute Value - {selectedYear}</h3>
            <br />
            <Chart options={chartData.options} series={chartData.series} type="bar" height={600} />

            <div style={{ marginTop: '20px', padding: '0 10px' }}>
                <Slider
                    min={0}
                    max={years.length - 1}
                    value={yearIndex}
                    onChange={handleYearChange}
                    step={1}
                    marks={[
                        { value: 0, label: years[0].toString() },
                        { value: years.length - 1, label: years[years.length - 1].toString() }
                    ]}
                    valueLabelDisplay="off"
                />
            </div>

            <p className="chart-footnote-center">
                <b>Source: </b>
                <span>
                    Data on each Major Scientific Agency’s R&D are from NSTMIS, Department of Science and Technology, Government of India.
                </span>
            </p>
        </div>
    );
};

export default MSAgerdabsvalue;