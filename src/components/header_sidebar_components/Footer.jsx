
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