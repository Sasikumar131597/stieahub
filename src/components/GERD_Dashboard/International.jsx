import React, { useEffect, useState } from "react";
import CountrySectorProportion from "./gerd_components/International/CountrySectorProportion";
import CountryGerdtoGdp from "./gerd_components/International/CountryGerdtoGdp";
import CountryGerdabsvalue from "./gerd_components/International/CountryGerdabsvalue";
import PageTitle from "../PageTitle";
import './styles/international.css';  // Ensure this has proper section and chart-container styles
import { fetchCountrySectorProportionData, fetchGerdToGdpData, fetchGerdAbsValueData } from "../helpers/apiHelper";
import Spinner from "../helpers/spinner";  // Import Spinner component

const International = () => {
    const [sectorProportionData, setSectorProportionData] = useState({});
    const [gerdToGdpData, setGerdToGdpData] = useState({});
    const [gerdAbsValueData, setGerdAbsValueData] = useState({});
    const [yearRange, setYearRange] = useState([2016, 2022]);
    const [loading, setLoading] = useState(true);  // Added loading state
    const [error, setError] = useState(null);      // Added error state

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all data in parallel
                const [sectorData, gerdToGdp, gerdAbs] = await Promise.all([
                    fetchCountrySectorProportionData(),
                    fetchGerdToGdpData(),
                    fetchGerdAbsValueData()
                ]);
                // Set data for each component
                setSectorProportionData(sectorData.formattedData || {});
                setGerdToGdpData(gerdToGdp.data || {});
                setGerdAbsValueData(gerdAbs.data || {});

                // Set year range dynamically if needed
                const allYears = Object.keys({
                    ...sectorData.data,
                    ...gerdToGdp.data,
                    ...gerdAbs.data
                }).map(year => parseInt(year));

                if (allYears.length > 0) {
                    setYearRange([Math.min(...allYears), Math.max(...allYears)]);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="spinner-container">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main id="main" className="main">
            {/*<PageTitle page="International Comparison" />*/}

            {/* Intro Section */}
            <div className="section text-center">
                <h2 className="section-title">International Comparison</h2>
                <p className="section-description">
                    The R&D intensity of countries representing respective R&D performance is often used to compare the R&D ecosystem. R&D intensity frequently occurs as a constituent indicator of global indices and measures such as WIPO’s Global Innovation Index (GII), and UN Sustainable Development Goals (SDGs).
                    <br />
                </p>
            </div>


            {/* Charts Section */}
            <div className="charts-wrapper">
                <div className="chart-container">
                    <CountryGerdabsvalue
                        initialData={gerdAbsValueData}
                        initialYearRange={yearRange}
                    />
                    <p className="chart-footnote" >
                        <b>Source: </b><span >Data on GERD and R&D Intensity of the select countries are from NCSES of Gov. of USA; OECD and World Bank</span>
                    </p>
                </div>
                <div className="chart-container">
                    <CountryGerdtoGdp
                        initialData={gerdToGdpData}
                        initialYearRange={yearRange}
                    />
                    <p className="chart-footnote" >
                        <b>Source: </b><span >Data on GERD and R&D Intensity of the select countries are from NCSES of Gov. of USA; OECD and World Bank</span>
                    </p>
                </div>
                <div className="sector-container">
                    <p className="sector-intro">
                        OECD’s Frascati Manual identifies four major sectors of R&D performance and GERD as the sum total of the sectoral R&D expenditures of these four sectors, namely:
                    </p>
                    <ul className="sector-list">
                        <li>Government</li>
                        <li>Business Enterprise</li>
                        <li>Higher Education</li>
                        <li>Private Non-Profit</li>
                    </ul>
                </div>
                <div className="chart-container">
                    <CountrySectorProportion
                        chartData={sectorProportionData}
                    />
                    <p className="chart-footnote" >
                        <b>Source: </b><span >Data on sectoral R&D expenditure of the select countries are from NCSES of Gov. of USA; OECD and World Bank
</span>
                    </p>
                </div>

            </div>
        </main>
    );
};

export default International;