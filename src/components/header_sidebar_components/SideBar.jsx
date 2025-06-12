import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import './styles/sidebar.css';
import { FaHome, FaHandshake, FaUsers, FaBinoculars, FaChartLine, FaAngleRight } from "react-icons/fa";
import { GrTechnology } from "react-icons/gr";
import { GiCoins } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";  // New generic subcategory icon


const sidebarNavItems = [
    { type: 'single', name: 'Home', icon: <FaHome size={20} />, link: '/' },
    {
        type: 'group',
        name: 'GERD Dashboard',
        icon: <GiCoins size={20} />,
        link: '/gerd_dashboard',
        items: [
            {
                type: 'group',
                name: 'Public R&D',
                icon: <MdOutlineSubdirectoryArrowRight size={16} />,
                link: '/gerd_dashboard/public_rnd',
                items: [
                    { name: 'Central Sector', icon: <FaAngleRight size={14} />, link: '/gerd_dashboard/central_rnd', isReactRouter: true },
                    { name: 'State Sector', icon: <FaAngleRight size={14} />, link: '/gerd_dashboard/state_rnd', isReactRouter: true }
                ]
            },
            { name: 'International Comparison', icon: <GoDotFill size={16} />, link: '/gerd_dashboard/international_gerd', isReactRouter: true },

        ]
    },

    { type: 'single', name: 'Scientific Workforce', icon: <FaChartLine size={20} />, link: '#' },
    { type: 'single', name: 'Startups', icon: <FaChartLine size={20} />, link: '#' },
    { type: 'single', name: 'R & D Institutions', icon: <FaChartLine size={20} />, link: '#' },
    { type: 'single', name: 'Critical Technology Tracker', icon: <GrTechnology size={20} />, link: '#' },
    { type: 'single', name: 'STI Partnership', icon: <FaHandshake size={20} />, link: 'https://sticonnect.info/public/' },
    { type: 'single', name: 'DEIA in STEMM', icon: <FaUsers size={20} />, link: '#' },
    { type: 'single', name: 'Other STI Indicators', icon: <FaChartLine size={20} />, link: '#' },
    
];

function SideBar() {
    const [expandedSections, setExpandedSections] = useState({});
    const location = useLocation();

    const toggleSection = (index) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                {sidebarNavItems.map((navItem, index) => {
                    const isActive = location.pathname.includes(navItem.link);

                    return navItem.type === 'group' ? (
                        <li key={index} className={`nav-item ${isActive ? 'active' : ''}`}>
                            <div className={`nav-link-container ${isActive ? 'highlight' : ''}`}>
                                <Link className="nav-link" to={navItem.link}>
                                    <span className="sidebar-icon">{navItem.icon}</span>
                                    <span>{navItem.name}</span>
                                </Link>

                                <button className="dropdown-btn" onClick={() => toggleSection(index)}>
                                    <i className={`bi ${expandedSections[index] ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                                </button>
                            </div>

                            <ul className={`submenu ${expandedSections[index] ? "open" : "closed"}`} style={{ display: expandedSections[index] ? "block" : "none" }}>
                                {navItem.items.map((subItem, subIndex) => {
                                    const isSubActive = location.pathname.includes(subItem.link);

                                    return subItem.type === 'group' ? (
                                        <li key={subIndex} className={`nav-item sub-group ${isSubActive ? 'active-sub' : ''}`}>
                                            <div className="nav-link">
                                                <Link className="nav-link" to={subItem.link}>
                                                    <span className="sidebar-icon">{subItem.icon}</span>
                                                    <span>{subItem.name}</span>
                                                </Link>

                                                <button className="dropdown-btn" onClick={() => toggleSection(`${index}-${subIndex}`)}>
                                                    <i className={`bi ${expandedSections[`${index}-${subIndex}`] ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                                                </button>
                                            </div>

                                            <ul className={`submenu ${expandedSections[`${index}-${subIndex}`] ? "open" : "closed"}`} style={{ display: expandedSections[`${index}-${subIndex}`] ? "block" : "none" }}>
                                                {subItem.items.map((childItem, childIndex) => (
                                                    <li key={childIndex} className={`nav-item sub-item ${location.pathname === childItem.link ? 'active-sub' : ''}`}>
                                                        <Link className="nav-link" to={childItem.link}>
                                                            <span className="sidebar-icon">{childItem.icon}</span>
                                                            <span>{childItem.name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ) : (
                                        <li key={subIndex} className={`nav-item sub-item ${isSubActive ? 'active-sub' : ''}`}>
                                            <Link className="nav-link" to={subItem.link}>
                                                <span className="sidebar-icon">{subItem.icon}</span>
                                                <span>{subItem.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ) : (
                        <li key={index} className={`nav-item ${isActive ? 'active' : ''}`}>
                            <Link className="nav-link" to={navItem.link}>
                                <span className="sidebar-icon">{navItem.icon}</span>
                                <span>{navItem.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}

export default SideBar;

