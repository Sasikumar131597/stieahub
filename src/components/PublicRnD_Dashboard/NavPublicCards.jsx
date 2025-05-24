import React from "react";
import { FaArrowRight } from "react-icons/fa";
import "./styles/navpubliccards.css";

const navItems = [
    { label: "Central Sector", link: "/gerd_dashboard/central_rnd" },
  { label: "State Sector", link: "/gerd_dashboard/state_rnd" },
];

const NavPublicCards = () => {
  return (
    <div className="navgerd-container">
      {navItems.map((item, index) => (
        <div key={index} className="navgerd-box" onClick={() => window.location.href = item.link}>
          <span className="navgerd-label">{item.label}</span>
          <FaArrowRight className="navgerd-icon" />
        </div>
      ))}
    </div>
  );
};

export default NavPublicCards;
