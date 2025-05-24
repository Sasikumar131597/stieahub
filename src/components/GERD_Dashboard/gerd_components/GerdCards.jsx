import React from "react";
import "./styles/gerdcards.css";

const GerdCards = ({ total_gerd_data, sectorGerdData, selectedYear }) => {
  // Ensure data exists for the selected year
  const totalGERD = total_gerd_data?.[selectedYear]?.value ?? "No data available";
  const sectorData = sectorGerdData?.[selectedYear] || {
    publicRND: "No data available",
    privateRND: "No data available",
    heiRND: "No data available",
  };

  // Define card items and values dynamically
  const items = [
    { label: "Total GERD", value: isNaN(totalGERD)? "-" : totalGERD },
    { label: "Public R&D", value:sectorData.publicRND==null? "-" : sectorData.publicRND },
    { label: "Private R&D", value: isNaN(sectorData.privateRND)? "-" : sectorData.privateRND },
    { label: "HEI R&D", value: isNaN(sectorData.heiRND)? "-" : sectorData.heiRND },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      {items.map((item, index) => (
        <div key={index} className={`dashboard-box box-${index + 1}`}>
          <div className="card-key">{item.label}</div>
          <div className="card-value">
            {typeof item.value === "number" ? `INR ${item.value.toFixed(2)} Cr` : item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GerdCards;