// import React from "react";
// import { FaArrowRight } from "react-icons/fa";
// import "./styles/navgerdcards.css";

// const navItems = [
//   { label: "Public R&D", link: "/gerd_dashboard/public_rnd" },
//   { label: "Private R&D", link: "/gerd_dashboard/private_rnd" },
//   { label: "HEI R&D", link: "/gerd_dashboard/hei-rnd" },
// ];

// const NavGerdCards = () => {
//   return (
//     <div className="navgerd-container">
//       {navItems.map((item, index) => (
//         <div key={index} className="navgerd-box" onClick={() => window.location.href = item.link}>
//           <span className="navgerd-label">{item.label}</span>
//           <FaArrowRight className="navgerd-icon" />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default NavGerdCards;


import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const navItems = [
  { label: "Public R&D", link: "/gerd_dashboard/public_rnd" },
  { label: "Private R&D", link: "/gerd_dashboard/private_rnd" },
  { label: "HEI R&D", link: "/gerd_dashboard/hei-rnd" },
];

const NavGerdCards = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Base styles
  const styles = {
    container: {
      display: 'flex',
      gap: '1.5rem',
      padding: '1rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    cardLink: {
      flex: 1,
      minWidth: '250px',
      maxWidth: '350px',
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      textDecoration: 'none',
      color: '#333',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      border: '1px solid #e0e0e0',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
    },
    cardLinkHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
      borderColor: '#4a90e2',
    },
    leftBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '4px',
      height: '100%',
      background: 'linear-gradient(to bottom, #4a90e2, #6a5acd)',
      transition: 'width 0.3s ease',
    },
    leftBorderHover: {
      width: '6px',
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#2c3e50',
    },
    icon: {
      color: '#4a90e2',
      transition: 'transform 0.3s ease',
    },
    iconHover: {
      transform: 'translateX(5px)',
    },
  };

  return (
    <div style={styles.container}>
      {navItems.map((item, index) => {
        const isHovered = hoveredCard === index;
        return (
          <a
            key={index}
            href={item.link}
            style={{
              ...styles.cardLink,
              ...(isHovered ? styles.cardLinkHover : {}),
              ...(window.innerWidth <= 768 ? { minWidth: '100%' } : {}),
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{
              ...styles.leftBorder,
              ...(isHovered ? styles.leftBorderHover : {}),
            }} />
            <div style={styles.cardContent}>
              <span style={styles.label}>{item.label}</span>
              <FaArrowRight style={{
                ...styles.icon,
                ...(isHovered ? styles.iconHover : {}),
              }} />
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default NavGerdCards;
