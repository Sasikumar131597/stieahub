import React, { useEffect } from 'react';
import './styles/logo.css';

function Logo() {
  // Ensure sidebar is collapsed by default when the component mounts
  // useEffect(() => {
  //   document.body.classList.add('toggle-sidebar'); // Add class on mount
  // }, []);

  // Function to toggle sidebar
  // const handleToggleSidebar = () => {
  //   document.body.classList.toggle('toggle-sidebar');
  // };

  return (
    <div className='d-flex align-items-center justify-content-between'>
      {/* <a href='/' className='logo d-flex align-items-center no-underline'>
        <span className='d-none d-lg-block'>STI Ecosystem Metrics and Analytics</span>
      </a> */}
        <span className='d-none d-lg-block project_title'><a href='/' className='logo d-flex align-items-center no-underline project_title'>STI Ecosystem Metrics and Analytics</a></span>
  
      {/* <i
        className='bi bi-list toggle-sidebar-btn'
        onClick={handleToggleSidebar}
      ></i> */}
    </div>
  );
}

export default Logo;