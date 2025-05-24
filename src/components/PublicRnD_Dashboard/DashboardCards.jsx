import React from "react";
import { Link } from "react-router-dom";
import "./styles/dashboardcards.css";
import {
    FaChartBar, FaHandshake, FaRegLightbulb,
    FaUniversalAccess, FaBinoculars, FaChartLine
} from "react-icons/fa";

const DashboardCards = () => {
    const items = [
        {
            label: "GERD",
            link: "/gerd_dashboard",
            icon: <FaChartBar />,
            description: "Explore Gross Expenditure on R&D across sectors."
        },
        {
            label: "STI-Partnership",
            link: "https://sticonnect.info/public/",
            icon: <FaHandshake />,
            description: "View data on Science, Technology & Innovation partnerships."
        },
        {
            label: "Critical Technology Tracker",
            link: "#",
            icon: <FaRegLightbulb />,
            description: "Track the progress of critical technologies."
        },
        {
            label: "DEIA in STEMM",
            link: "#",
            icon: <FaUniversalAccess />,
            description: "Diversity, Equity, Inclusion & Accessibility in STEMM."
        },
        {
            label: "Foresight",
            link: "#",
            icon: <FaBinoculars />,
            description: "Anticipate future trends in STI."
        },
        {
            label: "STI Indicators",
            link: "#",
            icon: <FaChartLine />,
            description: "Explore key indicators driving STI performance."
        },
    ];

    return (
        <div className="dashboard-tile-grid">
            {items.map((item, index) => {
                const CardContent = (
                    <div className="dashboard-tile">
                        <div className="dashboard-tile-inner">
                            {/* Front Side */}
                            <div className="dashboard-tile-front">
                                <div className="tile-icon">{item.icon}</div>
                                <div className="tile-label">{item.label}</div>
                            </div>

                            {/* Back Side */}
                            <div className="dashboard-tile-back">
                                <div className="tile-label">{item.label}</div>
                                <p className="tile-description">{item.description}</p>
                                <p className="tile-navigation-hint">Click to navigate</p>
                            </div>
                        </div>
                    </div>
                );

                return item.link.startsWith("http") ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" key={index} className="dashboard-tile-link">
                        {CardContent}
                    </a>
                ) : (
                    <Link to={item.link} key={index} className="dashboard-tile-link">
                        {CardContent}
                    </Link>
                );
            })}
        </div>
    );
};

export default DashboardCards;