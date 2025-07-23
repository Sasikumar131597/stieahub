import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const IndustriesList = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [sectorsLoading, setSectorsLoading] = useState(false);
  const [sectorsError, setSectorsError] = useState(null);

  // Function to get industry image URL
  const getIndustryImageUrl = (id) => {
    return `https://development.stieahub.in/Codigniter_api/public/assets/images/Industry_imgs/${id}.png`;
  };

  // Styles object
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    card: {
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '180px',
      width: '100%',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      minWidth: '150px'
    },
    imageContainer: {
      width: '100%',
      height: '120px',
      position: 'relative',
      overflow: 'hidden',
    },
    nameContainer: {
      padding: '10px 5px',
      textAlign: 'center',
      background: '#fff',
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      wordBreak: 'break-word',
      overflow: 'hidden'
    },
    industryNameText: {
      fontSize: '0.8rem',
      fontWeight: 'bold',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.2'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      transition: 'all 0.3s ease',
      backgroundColor: '#f5f5f5', // Fallback background color
    },
    countOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: 'all 0.3s ease',
      padding: '10px',
      textAlign: 'center',
      zIndex: 2
    },
    countText: {
      fontSize: '0.9rem',
      marginTop: '5px'
    },
    industryName: {
      fontSize: '1rem',
      fontWeight: 'bold'
    },
    loading: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
    },
    error: {
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
      color: 'red'
    },
    dialogContent: {
      minWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '20px'
    },
    sectorHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0'
    }
  };

  // Fetch industries data from API
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch('https://development.stieahub.in/Codigniter_api/public/industrieslist');
        if (!response.ok) {
          throw new Error('Failed to fetch industries data');
        }
        const data = await response.json();
        setIndustries(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  const handleCardClick = async (industry) => {
    setSelectedIndustry(industry);
    setOpenDialog(true);
    setSectorsLoading(true);
    setSectorsError(null);
    
    try {
      const response = await fetch(`https://development.stieahub.in/Codigniter_api/public/getstartups_industry_id/${industry.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sectors data');
      }
      const data = await response.json();
      setSectors(data);
    } catch (err) {
      setSectorsError(err.message);
    } finally {
      setSectorsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIndustry(null);
    setSectors([]);
  };

  if (loading) {
    return <div style={styles.loading}>Loading industries...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div>
      
      <div style={styles.container}>
        <h3 style={{ fontWeight: "bold" }}>Industries and Sectors</h3>
        <p>This section lets you analyse the architecture of the Indian startups. View the foundational Industries that form the pillars of economic growth in India. Then, examine the intricate framework of the Sectors built upon them to understand the market’s structure and identify the most influential areas of innovation.</p>

        <div style={styles.grid}>
          {industries.map((industry) => (
            <div 
              key={industry.id} 
              style={styles.card}
              onMouseEnter={() => setHoveredCard(industry.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(industry)}
            >
              <div style={styles.imageContainer}>
                <img 
                  src={getIndustryImageUrl(industry.id)} 
                  alt={industry.industry_category_name}
                  style={{
                    ...styles.image,
                    transform: hoveredCard === industry.id ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onError={(e) => {
                    e.target.style.backgroundColor = '#e0e0e0';
                    e.target.style.objectFit = 'contain';
                    e.target.src = ''; // Clear the src to prevent infinite error loop
                  }}
                />
                <div style={{
                  ...styles.countOverlay,
                  opacity: hoveredCard === industry.id ? 1 : 0
                }}>
                  <div style={styles.countText}>{industry.count} Startups</div>
                </div>
              </div>
              <div style={styles.nameContainer} title={industry.industry_category_name}>
                <Typography variant="body2" style={styles.industryNameText}>
                  {industry.industry_category_name}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedIndustry?.industry_category_name}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            ×
          </IconButton>
        </DialogTitle>
        <DialogContent style={styles.dialogContent}>
          {sectorsLoading ? (
            <div style={styles.loadingContainer}>
              <CircularProgress />
            </div>
          ) : sectorsError ? (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
              {sectorsError}
            </div>
          ) : (
            <List>
              {sectors.length > 0 ? (
                sectors.map((sector, index) => (
                  <React.Fragment key={sector.sector_id}>
                    <ListItem>
                      <ListItemText 
                        primary={
                          <div style={styles.sectorHeader}>
                            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                              {sector.sector_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {sector.count} Startups
                            </Typography>
                          </div>
                        }
                      />
                    </ListItem>
                    {index < sectors.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No sectors found for this industry" />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IndustriesList;