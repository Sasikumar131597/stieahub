import React, { useState, useEffect } from "react";
import { fetchConsolidatedPublicData } from "../helpers/apiHelper";  // Updated import
import "./styles/pagepublic.css";
import PageTitle from "../PageTitle";
import YearRange from "./gerd_components/YearRange";
import GerdCards from "./gerd_components/GerdCards";
import LineChartComponent from "./gerd_components/GERD_TrendLine";
import PieChart1 from "./gerd_components/PieChart1";
import Spinner from "../helpers/spinner";
import RatioChart from "./gerd_components/RatioChart";
import StackedAreaChart from "./gerd_components/StackedAreaChart";
import { FaChartLine, FaChartArea } from "react-icons/fa";
import NavPublicCards from "./NavPublicCards";
import axios from "axios";

function PublicRnd() {
    const [parsedData, setParsedData] = useState({});
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState("line");

    const [ratioData, setRatioData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
           // const { data, error } = await fetchConsolidatedPublicData();

            const publicRD = await axios.get('https://development.stieahub.in/Codigniter_api/public/getpublic_rnd');
           const data = await publicRD?.data;

          //  console.log("pub",publicRD?.data);

            if (error) {
                setError(error);
                setLoading(false);
                return;
            }

            setParsedData(data);
            const years = Object.keys(data).sort();
            setAvailableYears(years);
            setSelectedYear(years[years.length - 1]);  // Latest year

            // Prepare Ratio Data for Public, Central, and State R&D
            const formattedRatioData = years.map(year => {
                const yearData = data[year] || {};

                // Determine Public R&D Ratio
                const publicRatio = yearData.gdpRatio !== null ? yearData.gdpRatio
                                  : yearData.gnpRatio !== null ? yearData.gnpRatio
                                  : null;
                const publicType = yearData.gdpRatio !== null ? "GDP"
                                  : yearData.gnpRatio !== null ? "GNP"
                                  : "Unknown";

                // Determine Central R&D Ratio
                const centralRatio = yearData.centralGdpRatio !== null ? yearData.centralGdpRatio
                                   : yearData.centralGnpRatio !== null ? yearData.centralGnpRatio
                                   : null;
                const centralType = yearData.centralGdpRatio !== null ? "GDP"
                                   : yearData.centralGnpRatio !== null ? "GNP"
                                   : "Unknown";

                // Determine State R&D Ratio
                const stateRatio = yearData.stateGdpRatio !== null ? yearData.stateGdpRatio
                                 : yearData.stateGnpRatio !== null ? yearData.stateGnpRatio
                                 : null;
                const stateType = yearData.stateGdpRatio !== null ? "GDP"
                                 : yearData.stateGnpRatio !== null ? "GNP"
                                 : "Unknown";

                return {
                    year: String(year),
                    public: { ratio: publicRatio, type: publicType },
                    central: { ratio: centralRatio, type: centralType },
                    state: { ratio: stateRatio, type: stateType },
                };
            });

            setRatioData(formattedRatioData);

            // console.log("formattedRatioData",formattedRatioData);

            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <Spinner />;
    if (error) return <p>Error: {error}</p>;
    if (!selectedYear) return <p>No data available</p>;

    const currentYearData = parsedData[selectedYear] || {};

    const pieData = [
        { name: "Central R&D", value: currentYearData.central || 0 },
        { name: "State R&D", value: currentYearData.state || 0 },
    ];

    

    const trendLineData = availableYears.map(year => ({
        year,
        publicRND: parsedData[year]?.publicRND || NaN
    }));
    const stackedAreaData = availableYears.map(year => ({
        year,
        central: parsedData[year]?.central || NaN,
        state: parsedData[year]?.state || NaN
    }));

    return (
        <main className="bg-gray-50 p-4">
            <div className="text-center">
                <h1 className="section-title">Public R&D</h1>
                <p className="section-description">
                    Public R&D expenditure indicates the R&D performance by public entities. Public R&D expenditure is the total of Central Sector R&D expenditure and State Sector R&D expenditure.
                    <br />
                    {/*<span className="highlight">- Frascati Manual, OECD</span>*/}
                </p>
            </div>
            <div className="text-center">
                <p className="section-description">
                  Public R&D performance of India is understood using the following sectoral composition:
                </p>
                <div className="flex justify-center">
                  <ul className="list-disc text-left pl-5">
                    <li>Central Sector</li>
                    <li>State Sector</li>
                  </ul>
                </div>
              </div>
            <div className="flex justify-center gap-4 my-4">
                <NavPublicCards />
          </div>

            <div className="chart-container">
              <div className="chart-selector">
                <label htmlFor="chartType">Select Chart Type: </label>
                <select
                  id="chartType"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="dropdown-chart"
                >
                  <option value="line">Public R&D</option>
                  <option value="area">Sub-Sector-Wise</option>
                </select>
              </div>

              {chartType === "line" ? (
                <LineChartComponent chartData={trendLineData} />
              ) : (
                <StackedAreaChart sectorGerdData={stackedAreaData} />
              )}
            </div>

{/*<div className="chart-container relative">*/}
<div className="box flex justify-between items-center" style={{ width: "80%", margin: "20px auto", padding: "15px" }}>    {/* Left Side - Dropdown and Cards */}
        <div className="left-side flex flex-col" style={{ width: "50%" }}>
        <div className="dropdown">
            <YearRange selectedYear={selectedYear} setSelectedYear={setSelectedYear} availableYears={availableYears} />
        </div>
        <div className="tiles">
            <GerdCards
                totalGerdData={currentYearData.publicRND}
                centralGerdData={currentYearData.central}
                stateGerdData={currentYearData.state}
                selectedYear={selectedYear}
            />
        </div>
    </div>

    {/* Right Side - Centered Pie Chart */}
        <PieChart1 className="w-1/2" style={{width:"200px"}} pieData={pieData} selectedYear={selectedYear} />
    <p className="chart-footnote" >
      <b>Source: </b><span >Data on Central Sector R&D and State Sector R&D expenditures are from NSTMIS, Department of Science and Technology, Government of India</span>
    </p>
</div>
            {/*</div>*/}

            <div className="text-center my-6">
                <h1 className="section-title"></h1>
            </div>

            <div >
                <RatioChart ratioData={ratioData} />

            </div>
        </main>
    );
}

export default PublicRnd;