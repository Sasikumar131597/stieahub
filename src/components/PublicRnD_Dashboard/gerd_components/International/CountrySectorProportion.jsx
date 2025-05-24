import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { fetchCountrySectorProportionData } from "../../../helpers/apiHelper";

const CountrySectorProportion = (chartData) => {

    // const [chartData, setChartData] = useState([]);
    // const [error, setError] = useState(null);
    //
    // useEffect(() => {
    //     const loadData = async () => {
    //         const { formattedData, error } = await fetchCountrySectorProportionData();
    //         if (error) {
    //             setError(error);
    //         } else {
    //             setChartData(formattedData);
    //         }
    //     };
    //
    //     loadData();
    // }, []);

    // if (error) {
    //     return <div>Error loading data: {error}</div>;
    // }

    // Dynamically decide how many labels to show based on number of countries
    const getLabelInterval = (length) => {
        if (length > 10) return 1;  // show every 2nd
        if (length > 15) return 2;  // show every 3rd
        return 0;                    // show all
    };

   return (
    <div style={{ backgroundColor: "transparent" }}>
        <ResponsiveContainer width="100%" height={500}>
            <BarChart
                data={chartData.chartData}
                margin={{ top: 10, right: 30, left: 50, bottom: 60 }}
                barCategoryGap={20}
                style={{ background: "transparent" }}
            >
                <XAxis
                    dataKey="country"
                    tick={{ angle: -25, textAnchor: 'end', fontSize: 12 }}
                    interval={getLabelInterval(chartData.chartData.length)}
                    height={60}
                    label={{ value: 'Countries', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                    label={{ value: 'GERD Proportion (%)', angle: -90, position: 'center', dx: -20 }}
                />
                <Tooltip />
                <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: 15, marginBottom: -20 }}
                />
                <Bar dataKey="Business" fill="#4c78a8" />
                <Bar dataKey="Government" fill="#72b75c" />
                <Bar dataKey="HigherEducation" fill="#b07aa1" />
                <Bar dataKey="PrivateNonProfit" fill="#f58518" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);
};

export default CountrySectorProportion;