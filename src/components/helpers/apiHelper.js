import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000/api"; //localhost

// const BASE_URL = "https://9f97-119-82-127-2.ngrok-free.app/api";
const BASE_URL ="https://11b5-14-139-128-34.ngrok-free.app/api";

export const fetchTotalGerdData = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/fetch-data/`,
      {
        params: {
          sheet_name: "GERD Data",
          worksheet_name: "Over Period of Time",
          range: "$A2:$I" // Extended range to include all required ratios
        },
        headers: {
          "ngrok-skip-browser-warning": "true"  // Add this header
        },
      }
    );

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format from API");
    }

    const rawData = response.data.data;

    const formattedData = rawData.map((entry) => {
      const year = entry[0]; // Year (e.g., "1991-92")
      const value = entry[1] !== "-" ? parseFloat(entry[1]) : NaN; // R&D Expenditure

      // Function to determine the correct ratio (GDP > GNP > "No data available")
      const getRatio = (gdp, gnp) => {
        if (!isNaN(gdp)) return { ratio: gdp, type: "GDP" };
        if (!isNaN(gnp)) return { ratio: gnp, type: "GNP" };
        return { ratio: "No data available", type: "No data available" };
      };

      // Fetching ratios based on available values
      const gerdRatioData = getRatio(parseFloat(entry[3]), parseFloat(entry[2]));
      const publicRDRatioData = getRatio(parseFloat(entry[5]), parseFloat(entry[4]));
      const privateRDRatioData = getRatio(parseFloat(entry[6]), parseFloat(entry[7]));
      const heiRDRatioData = getRatio(parseFloat(entry[8]), NaN); // HEI only has GDP column

      return {
        year,
        value, // R&D Expenditure
        gerdRatio: gerdRatioData.ratio,
        gerdRatioType: gerdRatioData.type,
        publicRDRatio: publicRDRatioData.ratio,
        publicRDRatioType: publicRDRatioData.type,
        privateRDRatio: privateRDRatioData.ratio,
        privateRDRatioType: privateRDRatioData.type,
        heiRDRatio: heiRDRatioData.ratio,
        heiRDRatioType: heiRDRatioData.type,
      };
    });

    return { formattedData, error: null };
  } catch (error) {
    console.error("Error fetching Total GERD Data:", error.message);
    return { formattedData: [], error: error.response?.data?.message || error.message };
  }
};
export const fetchGerdSectorData = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/fetch-data/`,
      {
        params: {
          sheet_name: "GERD Data",
          worksheet_name: "Sector wise",
          range: "$A2:$E"
        },
        headers: {
          "ngrok-skip-browser-warning": "true"  // Add this header
        },
      }
    );
    const rawData = response.data?.data || [];

    const formattedData = rawData.map((entry) => {
      const year = entry[0]; // Year (e.g., "1958-59")
      const centralRND = entry[1] !== "-" ? parseFloat(entry[1]) : NaN;
      const stateRND = entry[2] !== "-" ? parseFloat(entry[2]) : NaN;
      const privateRND = entry[3] !== "-" ? parseFloat(entry[3]) : NaN;
      const heiRND = entry[4] !== "-" ? parseFloat(entry[4]) : NaN;

      return {
        year,
        centralRND,
        stateRND,
        privateRND,
        heiRND,
        publicRND:(isNaN(centralRND) && isNaN(stateRND))?null:(isNaN(centralRND) ? null : centralRND)  + (isNaN(stateRND) ? null: stateRND), // Public R&D = central + state
      };
    });

    return { formattedData, error: null };
  } catch (error) {
    return { formattedData: [], error: error.message };
  }
};
export const fetchCountrySectorProportionData = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/fetch-data/`,
      {
        params: {
          sheet_name: "GERD Data",                // Adjust if the sheet name differs
          worksheet_name: "Country_Sector_Proportion",       // Replace with correct worksheet name
          range: "$A1:$E"                         // Assuming A1 has headers, A2 onwards has data
        },
        headers: {
          "ngrok-skip-browser-warning": "true"    // Bypass ngrok warnings
        },
      }
    );

    const rawData = response.data?.data || [];

    // Transform raw data into the format expected by the chart
    const headers = rawData[0];  // First row is the header
    const formattedData = rawData.slice(1).map(row => ({
      country: row[0],
      Business: parseFloat(row[1]) || 0,
      Government: parseFloat(row[2]) || 0,
      HigherEducation: parseFloat(row[3]) || 0,
        PrivateNonProfit: parseFloat(row[4]) || 0,
    }));

    return { formattedData, error: null };
  } catch (error) {
    console.error("Error fetching Country Sector Proportion Data:", error.message);
    return { formattedData: [], error: error.response?.data?.message || error.message };
  }
};
export const fetchGerdToGdpData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/fetch-data/`, {
            params: {
                sheet_name: "GERD Data",               // Adjust sheet name if different
                worksheet_name: "Country_GERD(%GDP)", // Adjust worksheet name if different
                range: "$A1:$H",                       // Adjust range if needed
            },
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });

        const rawData = response.data?.data || [];

        // Convert array format into year-wise data (similar to your existing hardcoded object)
        const headerRow = rawData[0]; // First row is headers ["", "2016", "2017", ...]
        const years = headerRow.slice(1); // ["2016", "2017", "2018", ...]

        const transformedData = {};

        years.forEach((year, index) => {
            transformedData[year] = rawData.slice(1).map(row => ({
                country: row[0],
                value: parseFloat(row[index + 1]) || 0, // Values from second column onwards
            }));
        });

        return { data: transformedData, error: null };
    } catch (error) {
        console.error('Failed to fetch GERD to GDP data:', error);
        return { data: {}, error: error.message || 'Failed to fetch data' };
    }
};
export const fetchGerdAbsValueData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/fetch-data/`, {
            params: {
                sheet_name: "GERD Data",                     // Adjust if needed
                worksheet_name: "Country_GERD(abs)",    // Set the correct worksheet name
                range: "$A1:$H",                             // Adjust range if needed
            },
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });

        const rawData = response.data?.data || [];

        if (rawData.length < 2) {
            throw new Error("Insufficient data received");
        }

        // First row contains headers
        const headerRow = rawData[0];  // ["", "2016", "2017", ...]
        const years = headerRow.slice(1);  // ["2016", "2017", "2018", ...]

        // Initialize transformed data object
        const transformedData = {};

        // Populate data for each year
        years.forEach((year, index) => {
            transformedData[year] = rawData.slice(1).map(row => ({
                country: row[0],  // Country name
                value: parseFloat(row[index + 1]) || 0  // Absolute GERD value for the year
            }));
        });

        return { data: transformedData, error: null };
    } catch (error) {
        console.error("Failed to fetch GERD Absolute Value data:", error);
        return { data: {}, error: error.message || "Failed to fetch data" };
    }
};
export const fetchConsolidatedPublicData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/fetch-data/`, {
            params: {
                sheet_name: "GERD Data",                    // Adjust if needed
                worksheet_name: "Public_RnD_Over_Period_of_time",  // Example worksheet, modify if needed
                range: "$A1:$J",                            // Adjusted to match the new data structure
            },
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        });

        const rawData = response.data?.data || [];

        if (rawData.length < 2) {
            throw new Error("Insufficient data received");
        }

        const headerRow = rawData[0];  // Expected: ["Year", "Central", "State", "Public_R&D", "Public R&D GNP", "Public R&D GDP", "Central GDP", "Central GNP", "State GDP", "State GNP"]
        const rows = rawData.slice(1);  // Data rows

        const transformedData = {};

        rows.forEach(row => {
            const year = row[0];

            transformedData[year] = {
                year,
                central: row[1] === "-" ? 0 : parseFloat(row[1]) || 0,
                state: row[2] === "-" ? 0 : parseFloat(row[2]) || 0,
                publicRND: row[3] === "-" ? null : parseFloat(row[3]) || null,
                gnpRatio: row[4] === "-" ? null : parseFloat(row[4]) || null,
                gdpRatio: row[5] === "-" ? null : parseFloat(row[5]) || null,
                centralGdpRatio: row[6] === "-" ? null : parseFloat(row[6]) || null,
                centralGnpRatio: row[7] === "-" ? null : parseFloat(row[7]) || null,
                stateGdpRatio: row[8] === "-" ? null : parseFloat(row[8]) || null,
                stateGnpRatio: row[9] === "-" ? null : parseFloat(row[9]) || null,
            };
        });

        return { data: transformedData, error: null };
    } catch (error) {
        console.error("Failed to fetch Consolidated Public R&D Data:", error);
        return { data: {}, error: error.message || "Failed to fetch data" };
    }
};
export const fetchSunburstData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data",
        worksheet_name: "SB_Chart_CentralSector", // Ensure this worksheet exists
        range: "$A1:$F" // Assuming A = categories, B = subcategories, C-E = year values
      },
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;
    if (rawData.length < 2) {
      console.warn("Insufficient data received for Sunburst chart.");
      return { availableYears: [], transformData: () => [] };
    }

    // Extract headers for year selection dynamically
    const headers = rawData[0].slice(2); // ["2020-21", "2019-20", ...]
    // Transform data into Plotly Sunburst format
    let structuredData = [];
    let currentParent = null;
    for (let i = 1; i < rawData.length; i++) {
      let [category, subcategory, ...values] = rawData[i];
    
      // If the category is present, create a parent structure
      if (category) {
        currentParent = {
          name: category,
          children: []
        };
        structuredData.push(currentParent);
      }
    
      // If a subcategory is present, structure the subcategory and its values
      if (subcategory && currentParent) {
        let subData = {
          name: subcategory,  // Name of the subcategory
          title: rawData[i][rawData[i].length - 1], // The last column will be the title
          children: values.map((value, index) => ({
            name: headers[index], // Year
            value: value ? parseFloat(value) : 0
          }))
        };
    
        // Add the subcategory to its parent
        currentParent.children.push(subData);
      }
    }
    
    return {
      availableYears: headers,
      transformData: (year) => transformToSunburst(structuredData, year)
    };
  } catch (error) {
    console.error("Error fetching Sunburst Data:", error);
    return { availableYears: [], transformData: () => [] };
  }
};
const transformToSunburst = (data, selectedYear) => {
    let yearIndex = null;
    
    // Find the correct year index dynamically
    if (data.length > 0 && data[0].children.length > 0) {
        yearIndex = data[0].children[0].children.findIndex(item => item.name === selectedYear);
    }
    if (yearIndex === -1) return { labels: [], parents: [], values: [], titles: [] };

    // Include title (from the last column of the data)
    return {
        labels: data.flatMap(cat => [
            cat.name,
            ...cat.children.map(sub => sub.name)
        ]),
        parents: data.flatMap(cat => [
            "",
            ...Array(cat.children.length).fill(cat.name)
        ]),
        values: data.flatMap(cat => {
            const childrenValues = cat.children.map(sub => yearIndex !== null ? sub.children[yearIndex]?.value || 0 : 0);
            const parentValue = childrenValues.reduce((sum, val) => sum + val, 0); // Sum of children

            return [
                parentValue,  // Parent category value should be the sum of children
                ...childrenValues
            ];
        }),
        titles: data.flatMap(cat => [
            "", // No title for the root category
            ...cat.children.map(sub => sub.title) // Title from the `title` field (e.g., rawData[i][4])
        ])
    };
};


export const fetchMSAData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data", // Adjust the sheet name if necessary
        worksheet_name: "Major_Scientific_agencies", // Replace with the actual worksheet name
        range: "$A1:$AZ", // Ensure all years are included
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;

    // Extract years in descending order (latest first)
    let yearsDescending = rawData[0].slice(1).filter(year => year);

    // Sort years in ascending order
    let yearsAscending = [...yearsDescending].sort((a, b) => {
      const yearA = parseInt(a.split("-")[0], 10);
      const yearB = parseInt(b.split("-")[0], 10);
      return yearA - yearB;
    });

    let formattedData = {};
    for (let i = 1; i < rawData.length; i++) {
      const agencyName = rawData[i][0];
      if (!agencyName) continue; // Skip empty rows

      // Funding values are in descending order, so reverse them to match sorted years
      const values = rawData[i].slice(1).map((val) => {
        if (val === "-" || val === "" || val === null) {
          return null; // Mark as null so we can filter it out later
        }
        return parseFloat(val) || 0;
      }).reverse(); // Reverse so it aligns with sorted years

      if (values.length > 0) {
        formattedData[agencyName] = values;
      }
    }

    return { years: yearsAscending, agencies: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching MSA Data:", error.message);
    return { years: [], agencies: {}, error: error.message || "Failed to fetch MSA data" };
  }
};
export const fetchMDData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data", // Adjust if needed
        worksheet_name: "Ministries /Department", // Replace with actual worksheet name
        range: "$1:$1050", // Ensure all years are included
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;

    // Extract years (already in correct order)
    let years = rawData[0].slice(1).filter(year => year);

    let formattedData = {};
    for (let i = 1; i < rawData.length; i++) {
      const departmentName = rawData[i][0];
      if (!departmentName) continue; // Skip empty rows

      // Remove `"-"` values and convert valid numbers
      const values = rawData[i].slice(1).map((val) => {
        if (val === "-" || val === "" || val === null) {
          return null; // Mark as null so we can filter it out later
        }
        return parseFloat(val) || 0;
      });

      if (values.some(v => v !== null)) { // Ensure at least one valid value exists
        formattedData[departmentName] = values;
      }
    }

    return { years, departments: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching MD Data:", error.message);
    return { years: [], departments: {}, error: error.message || "Failed to fetch MD data" };
  }
};
export const fetchCentralTrendlineData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data",
        worksheet_name: "Central_RnD", // Replace with actual worksheet name
        range: "$A1:$D", // Ensure all columns (Year, MSA_RND, MD_RND) are included
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;
    let trendlineData = [];
    let stackedAreaData = [];

    for (let i = 1; i < rawData.length; i++) {
      const year = rawData[i][0];
      const msaValue = rawData[i][1] !== "-" ? parseFloat(rawData[i][1]) || null : null;
      const mdValue = rawData[i][2] !== "-" ? parseFloat(rawData[i][2]) || null : null;
      const centralSectorValue = rawData[i][3] !== "-" ? parseFloat(rawData[i][3]) || null : null;

      // Store 0 instead of null
      trendlineData.push({ year, value: centralSectorValue });

      // Include MSA & MD values in stacked area data
      stackedAreaData.push({ year, MSA_RND: msaValue, MD_RND: mdValue });
    }

    return { trendlineData, stackedAreaData, error: null };
  } catch (error) {
    console.error("Error fetching trendline data:", error.message);
    return { trendlineData: [], stackedAreaData: [], error: error.message || "Failed to fetch trendline data" };
  }
};
export const fetchMSABarData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data",
        worksheet_name: "MSA_BarGraph",
        range: "$1:$1050",
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;

    // Extracting available years from the first row
    const years = rawData[0].slice(1);

    let formattedData = {};
    for (let i = 1; i < rawData.length; i++) {
      const agencyName = rawData[i][0];
      if (!agencyName) continue;

      const values = rawData[i].slice(1).map((val) =>
        val === "-" || val === "" || val === null ? null : parseFloat(val) || 0
      );

      formattedData[agencyName] = values;
    }

    return { years, agencies: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching MSA Data:", error.message);
    return { years: [], agencies: {}, error: error.message || "Failed to fetch MSA data" };
  }
};
export const fetchMapAbsData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data",
        worksheet_name: "State_List",
        range: "$1:$1050", // Column A (State Names) to Column I (Years)
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;

    // Identify correct columns
    const stateColumnIndex = 2; // "Map_2014-2019" (Column A in sheet)
    const yearIndices = [3,4, 5, 6]; // 2015-16 to 2018-19 (Columns D to G)

    // Extract years dynamically from the header row
    const years = rawData[0].slice(3, 7); // ["2015-16", "2016-17", "2017-18", "2018-19"]

    let formattedData = {};

    for (let i = 1; i < rawData.length; i++) {
      const stateName = rawData[i][stateColumnIndex]; // Get state name
      if (!stateName || stateName === "-") continue;

      const values = yearIndices.map(index => {
        const val = rawData[i][index];
        return val === "-" || val === "" ? null : parseFloat(val);
      });

      formattedData[stateName] = values;
    }

    return { years, states: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching Map Data:", error.message);
    return { years: [], states: {}, error: error.message || "Failed to fetch map data" };
  }
};
export const fetchMapGSDPData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data",
        worksheet_name: "State_GSDP_Ratio",
        range: "$1:$1050", // Column A (State Names) to Column I (Years)
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;

    // Identify correct columns
    const stateColumnIndex = 0;
    const yearIndices = [1,2,3,4]; // 2015-16 to 2018-19 (Columns E to H)

    // Extract years dynamically from the header row
    const years = rawData[0].slice(4, 8); // ["2015-16", "2016-17", "2017-18", "2018-19"]

    let formattedData = {};

    for (let i = 1; i < rawData.length; i++) {
      const stateName = rawData[i][stateColumnIndex]; // Get state name
      if (!stateName || stateName === "-") continue;

      const values = yearIndices.map(index => {
        const val = rawData[i][index];
        return val === "-" || val === "" ? null : parseFloat(val);
      });

      formattedData[stateName] = values;
    }

    return { years, states: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching Map Data:", error.message);
    return { years: [], states: {}, error: error.message || "Failed to fetch map data" };
  }
};
export const fetchMapGDPData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data",
        worksheet_name: "State_GDP_Ratio",
        range: "$1:$1050", // Column A (State Names) to Column I (Years)
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;

    // Identify correct columns
    const stateColumnIndex = 0;
    const yearIndices = [1,2,3,4]; // 2015-16 to 2018-19 (Columns E to H)

    // Extract years dynamically from the header row
    const years = rawData[0].slice(4, 8); // ["2015-16", "2016-17", "2017-18", "2018-19"]

    let formattedData = {};

    for (let i = 1; i < rawData.length; i++) {
      const stateName = rawData[i][stateColumnIndex]; // Get state name
      if (!stateName || stateName === "-") continue;

      const values = yearIndices.map(index => {
        const val = rawData[i][index];
        return val === "-" || val === "" ? null : parseFloat(val);
      });

      formattedData[stateName] = values;
    }

    return { years, states: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching Map Data:", error.message);
    return { years: [], states: {}, error: error.message || "Failed to fetch map data" };
  }
};

export const fetchMapNewData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-data/`, {
      params: {
        sheet_name: "GERD Data",
        worksheet_name: "State_List",
        range: "$1:$1050", // Full range
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response format");
    }

    const rawData = response.data.data;

    const stateColumnIndex = 7; // Column 7 (0-indexed)
    const yearIndices = [8, 9]; // Columns 8 and 9 (0-indexed)
    const years = rawData[0].slice(8, 10); // Extract headers dynamically

    let formattedData = {};

    for (let i = 1; i < rawData.length; i++) {
      const stateName = rawData[i][stateColumnIndex];
      if (!stateName || stateName === "-") continue;

      const values = yearIndices.map(index => {
        const val = rawData[i][index];
        return val === "-" || val === "" ? null : parseFloat(val);
      });

      formattedData[stateName] = values;
    }

    return { years, states: formattedData, error: null };
  } catch (error) {
    console.error("Error fetching new map data:", error.message);
    return { years: [], states: {}, error: error.message || "Failed to fetch map data" };
  }
};