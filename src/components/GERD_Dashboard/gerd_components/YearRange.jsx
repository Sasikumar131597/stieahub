import React from "react";
import "./styles/yearrange.css";

const YearRange = ({ availableYears, selectedYear, setSelectedYear }) => {
  return (
    <div className="year-container">
      <label>Select Year</label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearRange;
