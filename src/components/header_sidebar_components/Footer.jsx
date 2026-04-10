
// import React from 'react';

// const Footer = () => {
//   const styles = {
//     footer: {
//       // backgroundColor: '#020049',
//       // color: '#ecf0f1',
//       // padding: '2rem 0',
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       width: '100%',
//     },
//     container: {
//       maxWidth: '1200px',
//       margin: '0 auto',
//       padding: '0 20px',
//     },
//     bottom: {
//       textAlign: 'center',
//       // paddingTop: '1.5rem',
//       // marginTop: '1.5rem',
//       // borderTop: '1px solid #34495e',
//     },
//   };

//   return (
//     <footer style={styles.footer}>
//       <div style={styles.container}>
//         <div style={styles.bottom}>
//           <p>&copy; {new Date().getFullYear()} STI Ecosystem Metrics and Analytics. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      // position: 'staic',
      // bottom: '0px',
      backgroundColor: '#f5f5f5',
      padding: '2rem 0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: '100%',
      // marginTop: '20%',
      borderTop: '1px solid #ddd'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: "25px"
    },
    column: {
      flex: '1',
      minWidth: '250px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '10px',
    },
    link: {
      display: 'block',
      margin: '6px 0',
      color: '#333',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    linkHover: {
      textDecoration: 'underline',
    },
    bottom: {
      textAlign: 'center',
      marginTop: '1.5rem',
      paddingTop: '1rem',
      borderTop: '1px solid #ccc',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* ABOUT SECTION */}
        <div style={styles.column}>
          <h3 style={styles.title}>About</h3>
          <a style={styles.link} href="/about-us">About Us</a>
          <a style={styles.link} href="/methodology">Methodology</a>
        </div>

        {/* QUICK LINKS */}
        <div style={styles.column}>
          <h3 style={styles.title}>Quick Links</h3>
          <a style={styles.link} href="/privacy-policy">Privacy Policy</a>
          <a style={styles.link} href="/terms">Terms & Conditions</a>
          <a style={styles.link} href="/contact">Contact</a>
        </div>

        {/* ADDRESS SECTION */}
        <div style={styles.column}>
          <h3 style={styles.title}>Address</h3>
          <p>
            Room No. 33010, 3rd Floor, Kartavya Bhavan 3,<br />
            Central Secretariat, New Delhi - 110001
          </p>
          {/* <p>Email: support@example.com</p> */}
        </div>

      </div>

      {/* COPYRIGHT */}
      <div style={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} STI Ecosystem Metrics and Analytics. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
