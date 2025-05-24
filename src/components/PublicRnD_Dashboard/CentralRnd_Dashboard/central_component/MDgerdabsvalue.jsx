import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Chart from "react-apexcharts";

const generateDummyData = () => {
    const agencies = Array.from({ length: 20 }, (_, i) => `Agency ${String.fromCharCode(65 + i)}`);
    const years = Array.from({ length: 11 }, (_, i) => 2010 + i);
    const data = {};

    years.forEach(year => {
        data[year] = agencies.map(agency => ({
            country: agency,
            value: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000 // Random values between 1000 and 5000
        }));
    });

    return data;
};

const MDgerdabsvalue = () => {
    const initialYearRange = [2010, 2020];
    const dummyData = generateDummyData();
    
    const [year, setYear] = useState(initialYearRange[0]);
    const [data, setData] = useState(dummyData);
    const [yearRange, setYearRange] = useState(initialYearRange);

    useEffect(() => {
        setData(dummyData);
        setYear(initialYearRange[0]);
        setYearRange(initialYearRange);
    }, []);

    const chartData = {
        series: [
            {
                name: "Major Scientific agencies Absolute Value (in USD millions)",
                data: data[year]?.map(d => ({
                    x: d.country,
                    y: d.value
                })) || []
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
                    dataLabels: {
                        position: "top",
                    }
                }
            },
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
                enabled: false
            },
            xaxis: {
                title: {
                    text: "Major Scientific agencies"
                },
                categories: data[year]?.map(d => d.country) || [],
                labels: {
                    rotate: -45,
                    style: { fontSize: "12px" }
                }
            },
            yaxis: {
                title: {
                    text: "Ministries/Departments Abs Value (in INR Cr.)"
                }
            }
        }
    };

    const handleYearChange = (event, newValue) => {
        setYear(newValue);
    };

    return (
<div className="MDgerdabsvalue-container" style={{ textAlign: "center", padding: "20px", margin: "auto", width: "100%", maxWidth: "1500px", overflowX: "hidden" }}>
    <h2 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
        Major Scientific Agencies Absolute Value - {year}
    </h2>
    <div style={{ width: "100%" }}>
        <Chart options={chartData.options} series={chartData.series} type="bar" height={400} width="250%" />
    </div>

    <div className="MDgerdabsvalue-slider-container" style={{ marginTop: '20px', padding: '0 10px' }}>
        <Slider
            min={yearRange[0]}
            max={yearRange[1]}
            value={year}
            onChange={handleYearChange}
            step={1}
            marks={yearRange.map(y => ({ value: y, label: y.toString() }))}
            valueLabelDisplay="off"
        />
    </div>
</div>
    );
};

export default MDgerdabsvalue;