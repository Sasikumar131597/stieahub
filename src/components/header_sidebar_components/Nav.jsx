import React, { useEffect, useState } from 'react';
import "./styles/nav.css";
import NavNotice from "./NavNotice";
import NavMessage from "./NavMessage";
import NavAvatar from "./NavAvatar";
import SearchBar from "./SearchBar";
function Nav() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
      document.body.classList.add('toggle-sidebar'); // Add class on mount
    }, []);
  
    // Function to toggle sidebar
    const handleToggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
      document.body.classList.toggle('toggle-sidebar');
    };

  return (
    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">
        {/* <SearchBar /> */}
        {/* <NavNotice /> */}
        {/* <NavMessage /> */}
        {/* <NavAvatar /> */}
        <i
        // className='bi bi-list toggle-sidebar-btn'
        className={`bi ${isSidebarOpen ? 'bi-x' : 'bi-list'} toggle-sidebar-btn`}
        onClick={handleToggleSidebar}
      ></i>
      </ul>
    </nav>
  );
}

export default Nav;
