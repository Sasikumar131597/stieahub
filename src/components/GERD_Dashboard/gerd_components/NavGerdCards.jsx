import React from "react";
import { FaArrowRight } from "react-icons/fa";
import "./styles/navgerdcards.css";

const navItems = [
  { label: "Public R&D", link: "/gerd_dashboard/public_rnd" },
  { label: "Private R&D", link: "/gerd_dashboard/private_rnd" },
  { label: "HEI R&D", link: "/gerd_dashboard/hei-rnd" },
];

const NavGerdCards = () => {
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

export default NavGerdCards;
