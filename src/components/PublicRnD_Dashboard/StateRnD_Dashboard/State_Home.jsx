import React, { useState, useEffect } from "react";
import MapComponent from "./components/MapComponent";
import { Slider, Tabs, Tab, Grid } from "@mui/material";
import { fetchMapAbsData, fetchMapGSDPData, fetchMapGDPData } from "../../helpers/apiHelper"; // API function
import Spinner from "../../helpers/spinner"; // Ensure spinner styling is applied

const TAB_NAMES = [
  "Map with Absolute Values",
  "Map with R&D Intensity with GDP",
  "Map with R&D Intensity with GSDP",
];

const State_Home = () => {
  const [yearIndex, setYearIndex] = useState(0); // Use index instead of string
  const [activeTab, setActiveTab] = useState(0);
  const [map1Data, setMap1Data] = useState({});
  const [map2Data, setMap2Data] = useState({});
  const [map3Data, setMap3Data] = useState({});
  const [years, setYears] = useState([]); // Store available years dynamically
  const [loading, setLoading] = useState(true); // Track API loading state
  const [highlightedState, setHighlightedState] = useState(null);

  // Fetch Data for Map 1 on Component Mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Fetch Map 1 data (Absolute Values)
      const { years: absYears, states: absStates, error: absError } = await fetchMapAbsData();

      // Fetch Map 2 data (R&D Intensity with GSDP)
      const { years: gsdpYears, states: gsdpStates, error: gsdpError } = await fetchMapGSDPData();

      // Fetch Map 3 data (R&D Intensity with GDP)
      const { years: gdpYears, states: gdpStates, error: gdpError } = await fetchMapGDPData();

      if (!absError && absYears.length > 0) {
        setYears(absYears);
        setMap1Data(absStates);
      }

      if (!gsdpError && gsdpYears.length > 0) {
        setMap2Data(gsdpStates);
      }

      if (!gdpError && gdpYears.length > 0) {
        setMap3Data(gdpStates);
      }

      setYearIndex(0); // Set default index to the first available year
      setLoading(false);
    };

    loadData();
  }, []);  // Handle undefined state data safely & extract correct year's value

  const getStateData = (mapName, selectedYear) => {
    if (!selectedYear) return {}; // Prevent crashes when year is null

    // Logic to handle the data for both year ranges
    if (mapName === TAB_NAMES[0]) {
      let formattedData = {};
      Object.keys(map1Data).forEach((state) => {
        const valueArray = map1Data[state];
        formattedData[state] = valueArray && yearIndex !== -1 ? valueArray[yearIndex] : null;
      });
      return formattedData;
    } else if (mapName === TAB_NAMES[2]) {
      let formattedData = {};
      Object.keys(map2Data).forEach((state) => {
        const valueArray = map2Data[state];
        formattedData[state] = valueArray && yearIndex !== -1 ? valueArray[yearIndex] : null;
      });
      return formattedData;
    } else if (mapName === TAB_NAMES[1]) {
      let formattedData = {};
      Object.keys(map3Data).forEach((state) => {
        const valueArray = map3Data[state];
        formattedData[state] = valueArray && yearIndex !== -1 ? valueArray[yearIndex] : null;
      });
      return formattedData;
    }

    return {}; // Default case
  };

  const getValueType = (mapName) => {
    if (mapName === TAB_NAMES[0]) {
      return "currency"; // ₹ Cr for Absolute Values
    } else {
      return "percentage"; // % for Intensity Charts
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh", padding: "10px" }}>
      {/* Title and Description */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1>State Sector R&D</h1>
        <p style={{ fontSize: "14px", color: "gray" }}>
          State Sector R&D expenditure of individual states of India indicates the R&D performance of the respective state government through their ministries/departments and agencies.
        </p>
      </div>

      {/* Tabs and Slider (above the map) */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="standard"
          centered
          sx={{
            "& .MuiTab-root": { minWidth: "auto", maxWidth: "100%", whiteSpace: "nowrap" },
          }}
        >
          {TAB_NAMES.map((mapName, index) => (
            <Tab key={mapName} label={mapName} />
          ))}
        </Tabs>

        {/* Show Spinner While Loading */}
        {loading ? (
          <div className="spinner-container">
            <Spinner />
          </div>
        ) : (
          years.length > 0 && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <h3>Select Year: {years[yearIndex] || "Data Not Available"}</h3>
              <Slider
                value={yearIndex}
                min={0}
                max={years.length - 1}
                step={1}
                marks={years.map((y, idx) => ({ value: idx, label: y }))}
                onChange={(e, newIndex) => setYearIndex(newIndex)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => years[value] || ""}
                style={{ width: "80%" }}
              />
            </div>
          )
        )}
      </div>

      {/* Main Map and Legend Layout */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          {/* Map Container */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {TAB_NAMES.map((mapName, index) => (
              <div key={mapName} style={{ display: activeTab === index ? "block" : "none", width: "100%" }}>
                <h2 style={{ textAlign: "center", marginBottom: "10px" }}>{mapName}</h2>
                <MapComponent
                  stateData={getStateData(mapName, years[yearIndex])}
                  valueType={getValueType(mapName)}
                  highlightedState={highlightedState}
                  setHighlightedState={setHighlightedState}
                  yearRange={yearIndex < 5 ? "2014-19" : "2019-25"} // Pass the range for shapefile selection
                />
              </div>
            ))}
          </div>
        </Grid>

        {/* Legend (2 columns) */}
        <Grid item xs={12} sm={4} style={{ maxHeight: "700px", overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          <div
            style={{
              backgroundColor: "#f8f8f8",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr", // Two columns
              gridGap: "20px", // Increase gap between name and value
              height: "100%", // Full height
              overflowY: "auto", // Scrollable if content overflows
            }}
          >
            <h4 style={{ textAlign: "center", marginBottom: "10px", gridColumn: "span 2" }}>
              State/UT Data
            </h4>
            {Object.entries(getStateData(TAB_NAMES[activeTab], years[yearIndex]))
              .sort(([stateA], [stateB]) => stateA.localeCompare(stateB)) // Sort alphabetically
              .map(([state, value]) => (
                <div
                  key={state}
                  style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    backgroundColor: highlightedState === state ? "#e0e0e0" : "#f0f0f0", // Light background for data
                    borderRadius: "5px",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "space-between", // For spacing
                    alignItems: "center", // Align vertically in the center
                  }}
                  onMouseEnter={() => setHighlightedState(state)}
                  onMouseLeave={() => setHighlightedState(null)}
                >
                  <span style={{ fontWeight: "bold", flex: 1 }}>{state}</span>
                  <span style={{ color: value === null ? "#888" : "black", marginLeft: "10px" }}>
                    {value !== null
                      ? getValueType(TAB_NAMES[activeTab]) === "currency"
                        ? `₹${value} Cr`
                        : `${value}`
                      : "No Data Available"}
                  </span>
                </div>
              ))}
          </div>
        </Grid>
      </Grid>

      {/* Footnote */}
      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "gray" }}>
        <p><b>* Data Source: <br /></b>State specific R&D expenditure and National GDP data are from NSTMIS, Department of Science and Technology, Government of India. <br /><br />Data on GSDP of individual states across the years are from Ministry of Statistics and Programme Implementation.</p>
      </div>
    </div>
  );
};

export default State_Home;