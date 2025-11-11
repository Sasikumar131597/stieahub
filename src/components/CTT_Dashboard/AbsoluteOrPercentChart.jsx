import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { Typography, Box, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

const LargeDashboardCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "400px",
  padding: theme.spacing(2)
}));

const lineChartData = [
  { year: "2015", publications: 1357, patents: 500, citations: 2000 },
  { year: "2016", publications: 1880, patents: 650, citations: 2400 },
  { year: "2017", publications: 2391, patents: 820, citations: 2900 },
  { year: "2018", publications: 3355, patents: 1100, citations: 3600 },
  { year: "2019", publications: 4713, patents: 1450, citations: 4300 },
  { year: "2020", publications: 5906, patents: 1700, citations: 5100 },
  { year: "2021", publications: 7572, patents: 2100, citations: 6100 },
  { year: "2022", publications: 8576, patents: 2400, citations: 7200 },
  { year: "2023", publications: 9163, patents: 2700, citations: 8100 },
  { year: "2024", publications: 10428, patents: 3000, citations: 9200 }
];

const convertToPercentages = (data) =>
  data.map((d) => {
    const total = d.publications + d.patents + d.citations;
    return {
      year: d.year,
      publications: ((d.publications / total) * 100).toFixed(2),
      patents: ((d.patents / total) * 100).toFixed(2),
      citations: ((d.citations / total) * 100).toFixed(2)
    };
  });

const AbsoluteOrPercentChart = ({ showPercentage }) => {
  const data = showPercentage ? convertToPercentages(lineChartData) : lineChartData;

  return (
    <LargeDashboardCard>
      <Typography variant="h6" color="primary" gutterBottom>
        {showPercentage ? "Publications as % of Total" : "Publications Over Time"}
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis unit={showPercentage ? "%" : ""} />
            <Tooltip />
            <Legend />
            <Line dataKey="publications" stroke="#0088FE" name="Publications" />
            <Line dataKey="patents" stroke="#00C49F" name="Patents" />
            <Line dataKey="citations" stroke="#FF8042" name="Citations" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </LargeDashboardCard>
  );
};

export default AbsoluteOrPercentChart;
