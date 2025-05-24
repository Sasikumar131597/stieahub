import React from "react";
import { Link } from "react-router-dom";
import "./styles/dashboardcards.css";
import {
    FaHandshake, FaUsers, FaBinoculars, FaChartLine, FaCoins
} from "react-icons/fa";
import {GrTechnology} from "react-icons/gr";
import { IoCashOutline } from "react-icons/io5";
import { GiCoins } from "react-icons/gi";

import { GiMoneyStack } from "react-icons/gi";

const DashboardCards = () => {
    const items = [
        {
            label: "GERD",
            link: "/gerd_dashboard",
            icon: <GiCoins />,
            description: "Explore R&D expenditure across countries and sectors"
        },
        {
            label: "STI-Partnership",
            link: "https://sticonnect.info/public/",
            icon: <FaHandshake />,
            description: "View bilateral STI partnership projects"
        },
        {
            label: "Critical Technology Tracker",
            link: "#",
            icon: <GrTechnology />,
            description: "Insights on critical and emerging technologies"
        },
        {
            label: "DEIA in STEMM",
            link: "#",
            icon: <FaUsers />,
            description: "Data on inclusivity in STEMM"
        },
        {
            label: "Foresight",
            link: "#",
            icon: <FaBinoculars />,
            description: "Trends and signals on future of technologies"
        },
        {
            label: "Other STI Indicators",
            link: "#",
            icon: <FaChartLine />,
            description: "Explore other key indicators (research personnel, start-ups and more..)"
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