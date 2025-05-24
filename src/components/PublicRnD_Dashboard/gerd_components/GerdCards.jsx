import React from "react";
import "./styles/gerdcards.css";

const GerdCards = ({ totalGerdData, centralGerdData, stateGerdData, selectedYear }) => {

  // Handle missing data gracefully
  const formatValue = (value) => {
    if (value === undefined || value === null) return "No data available";
    if (typeof value === "number") return `INR ${value.toFixed(2)} Cr`;
    return value;
  };

  // Define card items for central, state, and total GERD (no private/HEI)
  const items = [
    { label: "Total Public R&D", value: formatValue(totalGerdData) },
    { label: "Central Sector R&D", value: formatValue(centralGerdData) },
    { label: "State Sector R&D", value: formatValue(stateGerdData) },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item, index) => (
        <div key={index} className={`dashboard-box box-${index + 1}`}>
          <div className="card-key">{item.label}</div>
          <div className="card-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default GerdCards;