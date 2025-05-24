import React from "react";
import Plot from "react-plotly.js";

const SunburstChart = ({ sunburstData }) => {
    if (!sunburstData || !sunburstData.labels || !sunburstData.parents || !sunburstData.values) {
        return <p>Loading Sunburst Chart...</p>;
    }

    // Define fixed color scheme
    const colorMapping = {
        "Major Scientific Agencies": "rgba(255, 102, 102, 0.7)", // Light Red
        "Ministries/Departments": "rgba(135, 206, 250, 0.7)", // Light Blue
    };

    // Determine color for each segment
    const colors = sunburstData.labels.map((label, index) => {
        const parent = sunburstData.parents[index];

        if (colorMapping[label]) {
            return colorMapping[label]; // Use predefined light color for top-level
        } else if (colorMapping[parent]) {
            // If parent is one of the main categories, use a darker shade
            return colorMapping[parent].replace("0.3", "1"); // Increase opacity for outer sectors
        }
        return "#7f7f7f"; // Default grey (fallback)
    });

    // Custom Legend using annotations
    const legendItems = sunburstData.titles.map((title, index) => ({
        label: title,
        color: colors[index], // Use corresponding color for the title in the legend
        value: sunburstData.labels[index],
        values: sunburstData.values[index], // Include the value for each segment in the legend
    }));
    // Separate legend items for Major Scientific Agencies (Red) and Ministries/Departments (Blue)
    const majorScientificAgencies = legendItems.filter(item => item.color === "rgba(255, 102, 102, 0.7)").slice(1);  // Red
    const ministriesDepartments = legendItems.filter(item => item.color === "rgba(135, 206, 250, 0.7)").slice(1);  // Blue

    return (
        <div>
            <div className="sunburst-container">
                <div className="legend-panel-left">
                    <h4>Major Scientific Agencies (in INR Cr.)</h4>
                    <div className="legend-content">
                        {majorScientificAgencies.map((item, index) => (
                            <div key={index} className="legend-item">
                                {/*<span className="legend-color" style={{ backgroundColor: item.color }}></span>*/}
                                <span className="legend-label"><b style={{ backgroundColor: item.color }}>{item.value}</b> - {item.label} - <b>{item.values}</b></span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chart-panel">
                    <Plot
                        data={[{
                            type: "sunburst",
                            labels: sunburstData.labels,
                            parents: sunburstData.parents,
                            values: sunburstData.values,
                            hoverinfo: "label+value+text",  // Show label, value, and title on hover
                            // text: sunburstData.titles,  // Titles as hover text
                            branchvalues: "total",
                            marker: { colors: colors },
                            leaf: { opacity: 0.5 }, // Enables zoomable effect
                        }]}
                        layout={{
                            title: "Sunburst Chart for GERD Data",
                            width: 900,
                            height: 700,
                            margin: { l: 0, r: 0, b: 60, t: 30 },
                            uirevision: "true",
                        }}
                        config={{
                            scrollZoom: true,
                            displayModeBar: true,
                            modeBarButtonsToAdd: ["zoom2d", "pan2d", "resetScale2d"],
                        }}
                    />
                </div>

                <div className="legend-panel-right">
                    <h4>Ministries/Departments (in INR Cr.)</h4>
                    <div className="legend-content">
                        {ministriesDepartments.map((item, index) => (
                            <div key={index} className="legend-item">
                                {/*<span className="legend-color" style={{ backgroundColor: item.color }}></span>*/}
                                <span className="legend-label"><b style={{ backgroundColor: item.color }}>{item.value}</b> - {item.label} - <b>{item.values}</b></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <p className="chart-footnote">
                <b>Source:</b> Data on each Major Scientific Agencies R&D and Other M/Ds R&D are from NSTMIS, Department of Science and Technology, Government of India.
            </p>

            {/* Embedded CSS */}
            <style>
                {`
                    .sunburst-container {
                        display: flex;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        margin-bottom: 40px;
                    }

                    .chart-panel {
                        flex: 1;
                        overflow: hidden;
                    }

                    .legend-panel-left, .legend-panel-right {
                        width: 250px;
                        height: 700px;
                        overflow-y: scroll; /* Make the legend scrollable */
                        padding: 10px;
                        background-color: #f0f0f0;
                        margin-left: 20px;
                    }

                    .legend-panel-left h3, .legend-panel-right h3 {
                        // text-align: center;
                        margin-bottom: 20px;
                    }

                    .legend-content {
                        display: flex;
                        flex-direction: column;
                    }

                    .legend-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                        justify-content: space-between; /* Ensures even spacing */
                        width: 100%; /* Ensures it uses the full width */
                    }

                    .legend-color {
                        width: 15px;
                        height: 15px;
                        margin-right: 10px;
                    }

                    .legend-label {
                        flex: 1; /* Ensures label takes available space */
                        text-align: left; /* Align text to the left */
                    }

                    .chart-footnote {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #555;
                    }
                `}
            </style>
        </div>
    );
};

export default SunburstChart;
