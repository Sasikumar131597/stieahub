// import React from 'react';
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

// const Footer = () => {
//   // Styles object
//   const styles = {
//     footer: {
//       backgroundColor: '#2c3e50',
//       color: '#ecf0f1',
//       padding: '2rem 0',
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     },
//     container: {
//       maxWidth: '1200px',
//       margin: '0 auto',
//       padding: '0 20px',
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//       gap: '2rem',
//     },
//     section: {
//       marginBottom: '1.5rem',
//     },
//     heading: {
//       color: '#3498db',
//       marginBottom: '1rem',
//       fontSize: '1.2rem',
//       position: 'relative',
//       paddingBottom: '0.5rem',
//     },
//     headingAfter: {
//       content: '""',
//       position: 'absolute',
//       left: '0',
//       bottom: '0',
//       width: '50px',
//       height: '2px',
//       backgroundColor: '#3498db',
//     },
//     text: {
//       lineHeight: '1.6',
//       marginBottom: '1rem',
//     },
//     linksList: {
//       listStyle: 'none',
//       padding: '0',
//     },
//     linkItem: {
//       marginBottom: '0.5rem',
//     },
//     link: {
//       color: '#bdc3c7',
//       textDecoration: 'none',
//       transition: 'color 0.3s',
//       ':hover': {
//         color: '#3498db',
//       },
//     },
//     contactList: {
//       listStyle: 'none',
//       padding: '0',
//       lineHeight: '1.6',
//     },
//     socialIcons: {
//       display: 'flex',
//       gap: '1rem',
//     },
//     socialIcon: {
//       color: '#bdc3c7',
//       fontSize: '1.5rem',
//       transition: 'color 0.3s',
//       ':hover': {
//         color: '#3498db',
//       },
//     },
//     bottom: {
//       textAlign: 'center',
//       paddingTop: '1.5rem',
//       marginTop: '1.5rem',
//       borderTop: '1px solid #34495e',
//       fontSize: '0.9rem',
//     },
//     // Media query - note: in React inline styles, media queries need special handling
//     '@media (max-width: 768px)': {
//       container: {
//         gridTemplateColumns: '1fr',
//       },
//     },
//   };

//   // Helper function to handle nested styles and pseudo-elements
//   const getStyle = (styleNames) => {
//     return Array.isArray(styleNames) 
//       ? styleNames.reduce((acc, name) => ({ ...acc, ...styles[name] }), {})
//       : styles[styleNames];
//   };

//   return (
//     <footer style={getStyle('footer')}>
//       <div style={getStyle('bottom')}>
//         <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      // backgroundColor: '#020049',
      // color: '#ecf0f1',
      // padding: '2rem 0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: '100%',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    bottom: {
      textAlign: 'center',
      // paddingTop: '1.5rem',
      // marginTop: '1.5rem',
      // borderTop: '1px solid #34495e',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} STI Ecosystem Metrics and Analytics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;