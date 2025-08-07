import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation(); // Use the useLocation hook

  useEffect(() => {
    // Scroll to the top of the page when the pathname changes
    window.scrollTo(0, 0); 
  }, [pathname]); // Re-run this effect whenever the pathname changes

  return null; // This component doesn't render anything visible
}

export default ScrollToTop; // Export it directly, no withRouter needed