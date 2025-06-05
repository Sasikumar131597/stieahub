import React, { useState, useEffect } from "react";
import { fetchTotalGerdData, fetchSunburstData, fetchMSAData, fetchMDData, fetchCentralTrendlineData, fetchMSABarData } from "../../helpers/apiHelper"; // Import fetchMSABarData
import "./centralhome.css";
import CentralTrendline from "./central_component/Central_Trendline";
import CentralStackedAreaChart from "./central_component/Central_StackedAreaChart";
import CentralSunburst from "./central_component/CentralSunburst";
import Spinner from "../../helpers/spinner";
import { FaChartLine, FaChartArea } from "react-icons/fa";
import MultilineChart_MSA from "./central_component/MultilineChart_MSA";
import MultilineChart_MD from "./central_component/MultilineChart_MD";
import MSAgerdabsvalue from "./central_component/MSAgerdabsvalue";
import MDgerdabsvalue from "./central_component/MDgerdabsvalue";
import axios from "axios";

function Central_Home() {
  const [totalGerdData, setTotalGerdData] = useState({});
  const [sectorGerdData, setSectorGerdData] = useState({});
  const [loading, setLoading] = useState(true);
  const [sunburstLoading, setSunburstLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [sunburstData, setSunburstData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [names, setNames] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  // MSA Data State
  const [msaData, setMsaData] = useState(null);
  const [msaLoading, setMsaLoading] = useState(true);
  const [msaError, setMsaError] = useState(null);

  // MSABar Data State
  const [msaBarData, setMsaBarData] = useState(null);
  const [msaBarLoading, setMsaBarLoading] = useState(true);
  const [msaBarError, setMsaBarError] = useState(null);

  // MD Data State
  const [mdData, setMdData] = useState(null);
  const [mdLoading, setMdLoading] = useState(true);
  const [mdError, setMdError] = useState(null);

  // Trendline Data State
  const [trendlineData, setTrendlineData] = useState(null);
  const [trendlineLoading, setTrendlineLoading] = useState(true);
  const [trendlineError, setTrendlineError] = useState(null);

  const [stackedAreaData, setStackedAreaData] = useState(null);
  const [stackedAreaLoading, setStackedAreaLoading] = useState(true);
  const [stackedAreaError, setStackedAreaError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const gerddatav = await axios.get('https://development.stieahub.in/Codigniter_api/public/gerddata');
        

        setTotalGerdData(gerddatav?.data);
        setChartData(gerddatav?.data);
        

        const sunburnt_api = await axios.get('https://development.stieahub.in/Codigniter_api/public/getsunbuntdata');


        setAvailableYears(sunburnt_api?.data?.availableYears);
        setSelectedYear(sunburnt_api?.data?.selectedYear); // Default to the latest year
        setSunburstData(sunburnt_api?.data);

        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMSA = async () => {
      try {
        setMsaLoading(true);
        setMsaError(null);

       
        const msamultidataapi = await axios.get('https://development.stieahub.in/Codigniter_api/public/getmsamultilinevalue');

        setMsaData({
            years: msamultidataapi?.data?.years,
            agencies: msamultidataapi?.data?.agencies
          });

      } catch (err) {
        setMsaError(err.message);
      } finally {
        setMsaLoading(false);
      }
    };

    const fetchMSABar = async () => {
      try {
        setMsaBarLoading(true);
        setMsaBarError(null);

        const msabardataapi = await axios.get('https://development.stieahub.in/Codigniter_api/public/msaabsvalue');

        setMsaBarData({
            years: msabardataapi?.data?.years,
            agencies: msabardataapi?.data?.agencies
          });
      } catch (err) {
        setMsaBarError(err.message);
      } finally {
        setMsaBarLoading(false);
      }
    };

    const fetchMD = async () => {
      try {
        setMdLoading(true);
        setMdError(null);

        const mddataapi = await axios.get("https://development.stieahub.in/Codigniter_api/public/getmdmultilinevalue");
        setMdData({
            years: mddataapi?.data?.years,
            departments: mddataapi?.data?.departments
          });

      } catch (err) {
        setMdError(err.message);
      } finally {
        setMdLoading(false);
      }
    };

    const fetchTrendline = async () => {
      try {
        setTrendlineLoading(true);
        setStackedAreaLoading(true);
        setTrendlineError(null);
        setStackedAreaError(null);

       
        const treddata = await axios.get('https://development.stieahub.in/Codigniter_api/public/trendlinedata');

        const stackeddata = await axios.get('https://development.stieahub.in/Codigniter_api/public/sectorstackedarea');

        setTrendlineData(treddata?.data); // Pass Central Sector Data to Trendline
        setStackedAreaData(stackeddata?.data); // Pass MSA & MD Data to Stacked Area Chart
      } catch (err) {
        setTrendlineError(err.message);
        setStackedAreaError(err.message);
      } finally {
        setTrendlineLoading(false);
        setStackedAreaLoading(false);
      }
    };

    fetchData();
    fetchMSA();
    fetchMSABar();
    fetchMD();
    fetchTrendline();
  }, []);

const handleYearChange = async (event) => {
  const year = event.target.value;
  
  setSelectedYear(year);
  setSunburstLoading(true);

  try {
        const response = await axios.get('https://development.stieahub.in/Codigniter_api/public/getsunbuntdata', {
            params: {
                year: year
            }
        });

        
    setSunburstData(response?.data);
  } catch (error) {
    console.error("Error fetching Sunburst data:", error);
  } finally {
    setSunburstLoading(false);
  }
};

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;
  return (
    <main className="bg-gray-50 p-6 flex flex-col items-center">
      <div className="text-center ">
        <h1 className="section-title">Central Sector R&D</h1>
        <p className="section-description">
          Central Sector R&D expenditure indicates the R&D performance by Central Government Ministries/Departments, Agencies. R&D performance of Central Sector comprises the R&D performance of the Major Scientific Agencies of the Government of India and Ministries/Departments (M/Ds) of the Government of India other than Major Scientific Agencies.
        </p>
      </div>

      {/* Chart Selection Dropdown */}
      {/* <div style={{ position: "relative", marginBottom: "40px" }}> */}
        <div className="chart-container">
          <div className="chart-selector">
            <label htmlFor="chartType">Select Chart: </label>
              <select
              id="chartType"
               value={chartType}
               onChange={(e) => setChartType(e.target.value)}
               className="dropdown-chart">

              <option value="line">Central R&D</option>
              <option value="area">Sector-Wise</option>
            </select>
          </div>

          {chartType === "line" ? (
          trendlineLoading ? <Spinner /> : trendlineError ? <p>Error: {trendlineError}</p> : <CentralTrendline chartData={trendlineData} />
        ) : (
          stackedAreaLoading ? <Spinner /> : stackedAreaError ? <p>Error: {stackedAreaError}</p> : <CentralStackedAreaChart chartData={stackedAreaData} />
        )}

        </div>

        <div className="text-center mb-10">
          <br />
          <br />
          <h3 className="section-title">Central Sector R&D Expenditure Breakdown (INR Crore)</h3>
          <p className="section-description">
            Major Scientific Agencies comprise M/Ds or Agencies with a focus on scientific areas such as the Department of Biotechnology (DBT) and the Indian Council of Medical Research (ICMR).
            <br />
            <br />
            Ministries/Departments (M/Ds) of the Government of India other than Major Scientific Agencies include M/Ds or Agencies such as the Ministry of Railways and the Ministry of Home Affairs. It also includes Public Sector under Major Scientific Agencies and Joint Sector under State Undertaking.
            <br />
            <br />
          </p>
        </div>


{/* Sunburst Chart Section */}
<div className="mt-10 mb-10 text-center">
  <div className="dropdown-container mb-4">
    <label htmlFor="year-select">Select Year:</label>
    <select id="year-select" value={selectedYear} onChange={handleYearChange}>
        {availableYears
          .filter((year) => year !== "Name") // Exclude "Name"
          .map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
</select>
  </div>
  <CentralSunburst sunburstData={sunburstData} />
</div>



      {/* Multiline Chart for MSA Data */}
      <div className="mt-10 mb-10">
        {msaLoading ? <Spinner /> : msaError ? <p>Error: {msaError}</p> : <MultilineChart_MSA apiData={msaData} />}
      </div>

      {/* Multiline Chart for MD Data */}
      <div className="mt-15 mb-15">
        {mdLoading ? <Spinner /> : mdError ? <p>Error: {mdError}</p> : <MultilineChart_MD apiData={mdData} />}
      </div>
      <div className="mt-20 mb-15">
        {msaBarLoading ? <Spinner /> : msaBarError ? <p>Error: {msaBarError}</p> : <MSAgerdabsvalue msaData={msaBarData} />}
      </div>

      {/*<div className="mt-10 mb-10">*/}
      {/*  <MDgerdabsvalue />*/}
      {/*</div>*/}
    </main>
  );
}

export default Central_Home;