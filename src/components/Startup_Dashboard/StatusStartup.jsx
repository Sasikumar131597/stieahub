import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from "react-icons/fa";
import { GoXCircleFill } from "react-icons/go";
import { FcExpired } from "react-icons/fc";

const StatusStartup = () => {
  const [statusData, setStatusData] = useState({
    approve: 0,
    expired: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const response = await fetch('https://development.stieahub.in/Codigniter_api/public/statusofstartup');
        const data = await response.json();

        // Transform the API data into a more usable format
        const transformedData = data.data.reduce((acc, item) => {
          acc[item.status_name] = parseInt(item.count);
          return acc;
        }, {});

        setStatusData({
          approve: transformedData.approve,
          expired: transformedData.expired ,
          cancelled: transformedData.cancelled
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching status data:', error);
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Status of the Startup</h2>
      
      <div style={styles.statusContainer}>
        {/* APPROVED */}
        <div style={styles.statusCard}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#E3F5FF' }}>
            <FaCheckCircle color="#0D99FF" size={30} />
          </div>
          <div style={styles.statusText}>Approved</div>
          <div style={styles.statusCount}>{statusData.approve.toLocaleString()}</div>
        </div>
        
        {/* CANCELLED */}
        <div style={styles.statusCard}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#FFE3E3' }}>
            <GoXCircleFill color="#FF0D0D" size={30} />
          </div>
          <div style={styles.statusText}>Cancelled</div>
          <div style={styles.statusCount}>{statusData.cancelled.toLocaleString()}</div>
        </div>
        
        {/* EXPIRED */}
        <div style={styles.statusCard}>
          <div style={{ ...styles.iconContainer, backgroundColor: '#FFF7E3' }}>
            <FcExpired color="#FFC70D" size={30} />
          </div>
          <div style={styles.statusText}>Expired</div>
          <div style={styles.statusCount}>{statusData.expired.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '10px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  iconContainer: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 15px',
  },
  statusText: {
    fontSize: '14px',
    // color: '#666',
    marginBottom: '10px',
    // fontWeight: '500',
    fontWeight: 'bold',
    color: '#333',
  },
  statusCount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default StatusStartup;




