import React, { useState, useEffect } from "react";
import "./styles/pagegerd.css";
import YearRange from "./gerd_components/YearRange";
import GerdCards from "./gerd_components/GerdCards";
import LineChartComponent from "./gerd_components/GERD_TrendLine";
import PieChart1 from "./gerd_components/PieChart1";
import Spinner from "../helpers/spinner";
import RatioChart from "./gerd_components/RatioChart";
import StackedAreaChart from "./gerd_components/StackedAreaChart";
import NavGerdCards from "./gerd_components/NavGerdCards";
import axios from "axios";

function GERD_Home() {
  const [totalGerdData, setTotalGerdData] = useState({});
  const [sectorGerdData, setSectorGerdData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lineChartData, setLineChartData] = useState();
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [chartType, setChartType] = useState("line");

  const  Styles= {
    cardRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    modernContent: {
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#4a5568',
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '24px',
      borderLeft: '4px solid #3b82f6',
    },
};

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const trendOverData = await axios.get('https://development.stieahub.in/Codigniter_api/public/gerddatavalues');

      setLineChartData(trendOverData?.data);

      const gerdDict = trendOverData?.data?.reduce((acc, item) => {
        acc[item?.year] = item;
        return acc;
      }, {});

      setTotalGerdData(gerdDict);

      const sortedYears = trendOverData?.data?.map((item) => item?.year).sort();
      setAvailableYears(sortedYears);

      const latestValidYear = sortedYears?.reverse()?.find((year) => gerdDict[year]?.value);
      setSelectedYear(latestValidYear);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectorData = async () => {
    try {
      const sectorWiseData = await axios.get('https://development.stieahub.in/Codigniter_api/public/gettestsector');
      const sectorDict = sectorWiseData?.data?.reduce((acc, item) => {
        acc[item?.year] = item;
        return acc;
      }, {});
      setSectorGerdData(sectorDict);
    } catch (error) {
      console.error("Error fetching sector data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchSectorData();
    }
  }, [selectedYear]);

  if (loading) return <Spinner />;
  if (!selectedYear) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <img src="https://development.stieahub.in/Codigniter_api/public/assets/images/Banners/GERD_Home.png"  alt="GERD Home"/>
    <main className="p-4 max-w-7xl mx-auto" >
      <div style={Styles.cardRow} >
              <div className={Styles.modernContent}>
                "Gross domestic expenditure on R&D (GERD) is the main aggregate statistic used to describe a country's research and development (R&D) activities, which covers all expenditures for R&D performed in the national territory during a specific reference period. GERD is a primary indicator for international comparisons of R&D activity." 
                <br />
                <a href="https://www.oecd.org/en/publications/2015/10/frascati-manual-2015_g1g57dcb.html" target="_blank"><p align="right">- Frascati Manual, OECD</p></a>
                </div>
        </div>
      
      {/* First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 mb-4">
        {/* Left side - NavGerdCards */}
        <div className="lg:col-span-2">
          <NavGerdCards />
        </div>
        
        {/* Right side - GERD Trend */}
        <div className="lg:col-span-6 bg-white p-4 rounded-lg shadow-md relative">
          <div className="absolute top-4 right-4 z-10">
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)} 
              className="border p-1 rounded text-sm"
            >
              <option value="line">GERD Trend</option>
              <option value="area">Sector-Wise</option>
            </select>
          </div>
          {chartType === "line" ? (
            <LineChartComponent chartData={lineChartData} />
          ) : (
            <StackedAreaChart sectorGerdData={sectorGerdData} />
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
        {/* Left side - YearRange */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <YearRange 
            selectedYear={selectedYear} 
            setSelectedYear={setSelectedYear} 
            availableYears={availableYears} 
          />
          <div className="mt-4">
            <GerdCards 
              total_gerd_data={totalGerdData} 
              sectorGerdData={sectorGerdData} 
              selectedYear={selectedYear} 
            />
          </div>
        </div>
        
        {/* Right side - PieChart1 */}
        <div className="lg:col-span-4 bg-white p-4 rounded-lg shadow-md">
          <PieChart1
            pieData={[
              { name: "Public R&D", value: sectorGerdData[selectedYear]?.publicRND || 0 },
              { name: "Private R&D", value: sectorGerdData[selectedYear]?.privateRND || 0 },
              { name: "HEI R&D", value: sectorGerdData[selectedYear]?.heiRND || 0 },
            ]}
            selectedYear={selectedYear}
          />
          <p style={{fontSize:"12px",textAlign:"center"}}> <b>Source: </b>Data on GERD and sectoral R&D expenditures are from NSTMIS, Department of Science and Technology, Government of India</p>
        </div>
        
      </div>

      {/* Third Row - Full width RatioChart */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <h2 className="text-gray-800">R&D Intensity</h2>
          <p className="text-sm text-gray-600">
            GERD is often presented as a ratio of GERD divided by gross domestic product (GDP) as an indicator of the R&D intensity of a country’s economy, both over time and in comparison with other countries
            <p align="right">
          - <a href="https://www.oecd.org/en/publications/2015/10/frascati-manual-2015_g1g57dcb.html" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Frascati Manual, OECD
          </a>
        </p>
          
          </p>
        </div>
        <RatioChart ratioData={totalGerdData} availableYears={availableYears} />
      </div>

      {/* Footer/Source */}
      <div className="text-sm text-gray-600 mt-8">
        </div>
    </main>
    </div>
  );
}

export default GERD_Home;