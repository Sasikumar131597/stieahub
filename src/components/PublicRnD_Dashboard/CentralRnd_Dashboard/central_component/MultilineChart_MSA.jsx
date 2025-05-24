import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Select from "react-select";
import "../styles/multilinechart_msa.css";

const MultilineChart_MSA = ({ apiData }) => {
    const defaultAgencies = ["Defence Research & Development Organisation (DRDO)", "Department of Space (DOS)", "Indian Council of Agricultural Research (ICAR)"];
    const [selectedAgencies, setSelectedAgencies] = useState(defaultAgencies);
    const [formattedData, setFormattedData] = useState({ years: [], agencies: {} });

    useEffect(() => {
        if (!apiData || !apiData.years || !apiData.agencies) {
            return;
        }

        try {
            const years = apiData.years;
            const agencies = apiData.agencies;

            let formatted = {};
            Object.keys(agencies)
                .filter((agency) => agency !== "Total")
                .forEach((agency) => {
                const values = agencies[agency].map((val) => {
                    if (val === "-" || val === "" || val === null) {
                        return 0;
                    }
                    return parseFloat(val) || 0;
                });
                formatted[agency] = values;
            });

            setFormattedData({ years, agencies: formatted });

            const validDefaults = defaultAgencies.filter((agency) => agencies[agency]);
            setSelectedAgencies(validDefaults);
        } catch (error) {
            console.error("Error processing API data:", error);
        }
    }, [apiData]);

    const agencyOptions = Object.keys(formattedData.agencies || {}).map((agency) => ({
        value: agency,
        label: agency,
    }));

    const selectedOptions = agencyOptions.filter((option) =>
        selectedAgencies.includes(option.value)
    );

    // Generate dynamic colors based on agency count
    const generateColors = (count) => {
        return Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`);
    };

    const colors = generateColors(selectedAgencies.length);

    const chartData = {
        series: selectedAgencies.map((agency, index) => ({
            name: agency,
            data: formattedData.agencies[agency] || [],
            color: colors[index] // Assign dynamic colors
        })),
        options: {
            chart: {
                type: "line",
                height: 400,
                background: "#fff",
                toolbar: { show: true },
            },
            colors: colors, // Assign dynamic colors
            xaxis: {
                categories: formattedData.years || [],
                title: { text: "Years", style: { fontSize: "14px" }, show: true },
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
            legend: {
                show: true,
                position: "bottom",
                horizontalAlign: "center",
                floating: false,
                offsetY: 20,
                offsetX: 30,
            },
        },
    };

    return (
        <div>
            <br />
            <br />
            <h3 className="section-title">Major Scientific Agencies Trends</h3>
            <br />
            <Select
                options={agencyOptions}
                isMulti
                value={selectedOptions}
                onChange={(selectedOptions) =>
                    setSelectedAgencies(selectedOptions.map((option) => option.value))
                }
                placeholder="Select Agencies..."
                className="multilinechart_msa_multiselect"
            />
            <div className="chart-container">
                {selectedAgencies.length > 0 ? (
                    <Chart options={chartData.options} series={chartData.series} type="line" height={500} width={1200} />
                ) : (
                    <p>Select an agency to visualize data</p>
                )}
                <p className="chart-footnote-center">
                    <b>Source: </b>
                    <span>
                        Data from NSTMIS, Department of Science and Technology, Government of India
                    </span>
                </p>
            </div>
        </div>
    );
};

export default MultilineChart_MSA;
