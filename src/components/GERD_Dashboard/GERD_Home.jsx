import React, { useState, useEffect, useCallback } from "react";
import { fetchTotalGerdData, fetchGerdSectorData } from "../helpers/apiHelper";
import "./styles/pagegerd.css";
import PageTitle from "../PageTitle";
import YearRange from "./gerd_components/YearRange";
import GerdCards from "./gerd_components/GerdCards";
import LineChartComponent from "./gerd_components/GERD_TrendLine";
import PieChart1 from "./gerd_components/PieChart1";
import Spinner from "../helpers/spinner";
import RatioChart from "./gerd_components/RatioChart";
import StackedAreaChart from "./gerd_components/StackedAreaChart";
import { FaChartLine, FaChartArea } from "react-icons/fa";
import NavGerdCards from "./gerd_components/NavGerdCards";
import axios from "axios";

function GERD_Home() {
  const [totalGerdData, setTotalGerdData] = useState({});
  const [sectorGerdData, setSectorGerdData] = useState({});
  const [dataUpdated, setDataUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [chartData, setChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState();
  const [lineStackedData, setLineStackedData] = useState();
  const [pieData1, setPieData1] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [chartType, setChartType] = useState("line");

  const Piedata  = useCallback(() => {
  return (<PieChart1 className="w-1/2"
            pieData={[
              { name: "Public R&D", value: sectorGerdData[selectedYear]?.publicRND || 0 },
              { name: "Private R&D", value: sectorGerdData[selectedYear]?.privateRND || 0 },
              { name: "HEI R&D", value: sectorGerdData[selectedYear]?.heiRND || 0 },
            ]}
            selectedYear={selectedYear}
          />)
} ,[selectedYear,sectorGerdData]);

// console.log("piedd",sectorGerdData);

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

        // console.log("gerddd",gerdDict);
        setTotalGerdData(gerdDict);


        const sortedYears = trendOverData?.data?.map((item) => item?.year).sort();
        setAvailableYears(sortedYears);

        const latestValidYear = sortedYears?.reverse()?.find((year) => gerdDict[year]?.value);
        setSelectedYear(latestValidYear);



        setDataUpdated((prev) => !prev);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    
    fetchData();
  }, []);

  const fetchSectorData = async () => {


    const sectorWiseData = await axios.get('https://development.stieahub.in/Codigniter_api/public/getsectordatavalues');

    const sectorDict = await sectorWiseData?.data?.reduce((acc, item) => {
      acc[item?.year] = item;
      return acc;
    }, {});

    setSectorGerdData(sectorDict);

    setPieData1(
      sectorWiseData?.data?.map((item) => ({
        year: item?.year,
        publicRND: parseFloat(item?.centralRND || 0) + parseFloat(item?.stateRND || 0),
        privateRND: parseFloat(item?.privateRND || 0),
        heiRND: parseFloat(item?.heiRND || 0),
      }))
    );

  }

  useEffect(() => {

    fetchSectorData();

  }, [selectedYear,setLineChartData]);

  if (loading) return <Spinner />;



  return (
    <main className="bg-gray-50 p-4">
      <div className="text-center my-6">
        <h1 className="section-title">Gross Domestic Expenditure on R&D (GERD)</h1>
        <p className="section-description">
          "Gross domestic expenditure on R&D (GERD) is the main aggregate statistic used to describe a country’s research and development (R&D) activities, which covers all expenditures for R&D performed in the national territory during a specific reference period. GERD is a primary indicator for international comparisons of R&D activity"
        </p>
        <p className="highlight">
          - <a href="https://www.oecd.org/en/publications/2015/10/frascati-manual-2015_g1g57dcb.html" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Frascati Manual, OECD
          </a>
        </p>
      </div>

      <div className="text-center">
        <p className="section-description">
          R&D performance of India is understood using the following sectoral composition:
        </p>
        <div className="flex justify-center">
          <ul className="list-disc text-left pl-5">
            <li>Public Sector</li>
            <li>Private Sector</li>
            <li>Higher Education Institutions</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center gap-4 my-4">
        <NavGerdCards />
      </div>

      <div style={{ position: "relative" }}>
        <div className="chart-selector"
          style={{
            position: "absolute",
            top: "10px",
            right: "250px",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.8)",
            padding: "5px 10px",
            borderRadius: "5px"
          }}>
          <label htmlFor="chartType">Select Chart Type: </label>
          <select id="chartType" value={chartType} onChange={(e) => setChartType(e.target.value)} className="dropdown-chart">
            <option value="line">GERD</option>
            <option value="area">Sector-Wise</option>
          </select>
        </div>

        {chartType === "line" ? <LineChartComponent chartData={lineChartData} /> : <StackedAreaChart sectorGerdData={sectorGerdData} />}
      </div>

      <div className="container">
        <div className="box flex justify-between items-center">
          {/* Left Side - Dropdown and Cards */}
          <div className="left-side flex flex-col" style={{ width: "30%" }}>
            <div className="dropdown">
              <YearRange selectedYear={selectedYear} setSelectedYear={setSelectedYear} availableYears={availableYears} />
            </div>
            <div className="tiles">
              <GerdCards total_gerd_data={totalGerdData} sectorGerdData={sectorGerdData} selectedYear={selectedYear} />
            </div>
          </div>

          {/* Right Side - Pie Chart */}
          {Piedata()}
          
          <p className="chart-footnote" >
            <b>Source: </b><span >Data on GERD and sectoral R&D expenditures are from NSTMIS, Department of Science and Technology, Government of India
            </span>
          </p>
        </div>

      </div>


      <br />
      <br />
      <div className="text-center my-7">
        <h1 className="section-title">R&D Intensity</h1>
        <p className="section-description">
          GERD is often presented as a ratio of GERD divided by gross domestic product (GDP) as an indicator of the R&D intensity of a country’s economy, both over time and in comparison with other countries
        </p>
        <p className="highlight">
          - <a href="https://www.oecd.org/en/publications/2015/10/frascati-manual-2015_g1g57dcb.html" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Frascati Manual, OECD
          </a>
        </p>
      </div>

      <RatioChart ratioData={totalGerdData} availableYears={availableYears} />
    </main>
  );
}

export default GERD_Home;
