import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import "./css/TrendPublicationsPatents.css";

const TrendPublicationsPatents = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Global Trend API
  useEffect(() => {
    const loadGlobalTrend = async () => {
      try {
        const res = await fetch(
          "https://development.stieahub.in/Codigniter_api/public/get_publication_patent_global_data"
        );

        const data = await res.json();

        const formatted = data.map((row) => ({
          year: Number(row.year),
          Publications: Number(row.total_publications),
          Patents: Number(row.total_patents),
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("API Error (Global Trends):", err);
      } finally {
        setLoading(false);
      }
    };

    loadGlobalTrend();
  }, []);

  if (loading)
    return (
      <div className="trend-card">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="trend-card">
      <ResponsiveContainer width="100%" height={380}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

          <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="#333" />

          <YAxis tick={{ fontSize: 12 }} stroke="#333" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />

          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: 13 }}
          />

          <Line
            type="monotone"
            dataKey="Publications"
            stroke="#007bff"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="Patents"
            stroke="#ff7b2c"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendPublicationsPatents;

