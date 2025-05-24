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
                height: 450,
                width: "100%",
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
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "50%",
                    endingShape: "rounded"
                }
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => val.toFixed(2),
                offsetY: -10,
                style: {
                    fontSize: "12px",
                    colors: ["#304758"]
                }
            },
            xaxis: {
                categories: data[year]?.map(d => d.country) || [],
                labels: {
                    rotate: -45,
                    style: { fontSize: "12px", fontWeight: "bold" }
                }
            },
            yaxis: {
                title: {
                    text: "GERD to GDP (%)",
                    style: { fontSize: "14px", fontWeight: "bold" }
                },
                labels: {
                    style: { fontSize: "12px", fontWeight: "bold" }
                }
            },
            grid: {
                borderColor: "#E3E3E3",
                strokeDashArray: 4
            },
            tooltip: { enabled: true },
            colors: ["#1E88E5"]
        }
    };

    const handleYearChange = (event, newValue) => {
        setYear(newValue);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", margin: "auto", width: "100%" }}>
  <h4 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: "bold" }}>
    Country GERD R&D Intensity - {year}
  </h4>
 <div >
    <Chart options={chartData.options} series={chartData.series} type="bar" height={450} width={"100%"} />
</div>


  <div>
    <Slider
      min={yearRange[0]}
      max={yearRange[1]}
      value={year}
      onChange={handleYearChange}
      step={1}
      marks={yearRange.map(y => ({ value: y, label: y.toString() }))}
      valueLabelDisplay="off"
      style={{ color: "#1E88E5" }}
    />
  </div>
</div>
    );
};

export default CountryGerdtoGdp;