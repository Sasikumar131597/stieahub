import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Chart from "react-apexcharts";

const CountryGerdtoGdp = ({ initialData, initialYearRange }) => {
    const [year, setYear] = useState(initialYearRange[0] || null);
    const [data, setData] = useState(initialData || {});
    const [yearRange, setYearRange] = useState(initialYearRange || [2016, 2022]);

    useEffect(() => {
        setData(initialData);
        setYear(initialYearRange[0]);
        setYearRange(initialYearRange);
    }, [initialData, initialYearRange]);

    const chartData = {
        series: [
            {
                name: "GERD to GDP",
                data: data[year]?.map(d => ({
                    x: d.country,
                    y: d.value
                })) || []
            }
        ],
        options: {
            chart: {
                type: "bar",
                toolbar: { show: true,
                        tools: {
                        download: true,     // Allow download as PNG, SVG
                        selection: true,    // Enable selection zoom
                        zoom: true,         // Enable zoom
                        zoomin: true,       // Zoom in button
                        zoomout: true,      // Zoom out button
                        pan: true,          // Enable pan (drag)
                        reset: true         // Reset zoom
                    }
                },
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        position: "top",  // Labels on top of each bar
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => val.toFixed(2),
                offsetY: -20,
                style: {
                    fontSize: "12px",
                    colors: ["#304758"]
                }
            },
            tooltip: { enabled: false
            },
            xaxis: {
                categories: data[year]?.map(d => d.country) || [],
                labels: {
                    rotate: -45,
                    style: { fontSize: "12px" }
                }
            },
            yaxis: {
                title: {
                    text: "GERD to GDP (%)"
                }
            }
        }
    };

    const handleYearChange = (event, newValue) => {
        setYear(newValue);
    };

    return (
        <div>
            <h5>Selected Year - {year}</h5>
            <Chart options={chartData.options} series={chartData.series} type="bar" height={400} />

            <div style={{ marginTop: '20px', padding: '0 10px' }}>
                <Slider
                    min={yearRange[0]}
                    max={yearRange[1]}
                    value={year}
                    onChange={handleYearChange}
                    step={1}
                    marks={yearRange.map(y => ({ value: y, label: y.toString() }))}
                    valueLabelDisplay="off"  // No need to show floating label since marks show all years
                />
            </div>
        </div>
    );
};

export default CountryGerdtoGdp;