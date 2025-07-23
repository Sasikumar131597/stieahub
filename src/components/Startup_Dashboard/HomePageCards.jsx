import React, { useEffect, useState } from 'react';
import { FaIndustry, FaChartPie, FaUsers, FaRegBuilding } from 'react-icons/fa';
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { BsBuildingsFill } from "react-icons/bs";
import axios from 'axios';
import Styles from './css/HomePageCards.module.css';
import StagePiechart from './StagePiechart';
import TopStates from './TopStates';
import Grid from '@mui/material/Grid2';
import StatusStartup from './StatusStartup';
import TopTenSectors from './TopTenSectors';
import IndustryBubbleChart from './IndustryBubbleChart';

const HomePageCards = () => {
  const [counts, setCounts] = useState({ startups: 0, industries: 0, sectors: 0 });
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts data
        const countsResponse = await axios.get('https://development.stieahub.in/Codigniter_api/public/getcardscounts');
        setCounts(countsResponse.data);
        
        // Fetch business types data
        const typesResponse = await axios.get('https://development.stieahub.in/Codigniter_api/public/getcardsnatureofentity');
        setBusinessTypes(typesResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  // Function to get count for specific business type
  const getBusinessTypeCount = (value) => {
    const type = businessTypes.find(item => item.value === value.toString());
    return type ? type.count : '0';
  };

  return (
    <div>
      <img src="https://development.stieahub.in/Codigniter_api/public/assets/images/Banners/STIEA_Startup.png"  />
    <div className={Styles.container}>
      <div className={Styles.cardRow}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <div className={Styles.modernContent}>
                  "Startups are the engines of exponential growth, manifesting the power of innovation. Several big companies today are startups of yesterday. They were born with a spirit of enterprise and adventure, kept alive due to hardwork and perseverance, and today have become shining beacons of innovation" - Prime Minister Narendra Modi
               </div>
            </Grid>
          </Grid>
          
        </div>
          <h5 style={{ fontWeight: "bold" }}>About this Dashboard:</h5>
          <p>Startups in India have become synonymous with the country's fast-paced growth journey. This dashboard is designed to give insights into the startup ecosystem of India, providing a snapshot of entrepreneurship and innovation in the country. By highlighting key Industrial sectors in which these startups function and the top-performing geographical areas in the country, this dashboard enables concerned stakeholders to identify gaps and strengths and take evidence-backed policy measures to better support startups in the country.</p>

      <div className={Styles.cardRow}>
         <Grid container spacing={2}>
        <Grid size={4} className={Styles.statcard}>
            <div className={Styles.cardheader} style={{ backgroundColor: '#3b669d', borderColor: '#3B82F6' }}>
            <HiMiniBuildingOffice className={Styles.cardicon} style={{ color: 'white' }} />
          </div>
          <div className={Styles.cardcontent}>
            <h3 className={Styles.cardtitle}>No. of Startups</h3>
            <p className={Styles.cardvalue}>{counts.startups}</p>
          </div>
        </Grid>
        <Grid size={4} className={Styles.statcard}>
          <div className={Styles.cardheader} style={{ backgroundColor: '#329a69', borderColor: '#10B981' }}>
            <FaIndustry className={Styles.cardicon} style={{ color: 'white' }} />
          </div>
          <div className={Styles.cardcontent}>
            <h3 className={Styles.cardtitle}>No. of Industries</h3>
            <p className={Styles.cardvalue}>{counts.industries}</p>
          </div>
        </Grid>
        <Grid size={4} className={Styles.statcard}>
          <div className={Styles.cardheader} style={{ backgroundColor: '#943735', borderColor: '#EF4444' }}>
            <FaChartPie className={Styles.cardicon} style={{ color: 'white' }} />
          </div>
          <div className={Styles.cardcontent}>
            <h3 className={Styles.cardtitle}>No. of Sectors</h3>
            <p className={Styles.cardvalue}>{counts.sectors}</p>
          </div>
        </Grid>
      </Grid>
        
      </div>


      

     <div className={Styles.cardRow}>
       <Grid container spacing={2}>
            <Grid size={6}>
                  <StagePiechart />
                  <p style={{fontSize:"12px",textAlign:"center"}}><b>Source: </b>Data on the Stages - Early Traction, Scaling, Validation, and Ideation are from DPIIT (Startup India).</p>
            </Grid>
          <Grid size={6}>
                    <h3 className={Styles.Topindustrihead}>Top Industries</h3>
                    <IndustryBubbleChart />
                    <p style={{fontSize:"12px",textAlign:"center"}}><b>Source: </b>Data on the Startup Industries is from DPIIT (Startup India).</p>
            
          </Grid>
        </Grid>
       </div>


       <div className={Styles.cardRow}>
       <Grid container spacing={2}>

              <Grid size={6}>
                      <h3 className={Styles.Topindustrihead}>Top Sectors</h3>
                      <TopTenSectors />
                      <p style={{fontSize:"12px",textAlign:"center"}}><b>Source: </b>Data on the Startup Sectors is from DPIIT (Startup India).</p>
              </Grid>
                <Grid size={6}>
                    <h3 className={Styles.Topindustrihead}>Top 10 States</h3>
                    <TopStates />
                    <p style={{fontSize:"12px",textAlign:"center"}}><b>Source: </b>Data on the Startup geographies is from DPIIT (Startup India).</p>
                </Grid>
              
        </Grid>
       </div>

       <div className={Styles.cardRow}>
       <Grid container spacing={2}>
            <Grid size={6}>
                  <div className={Styles.statcard}> 
                  <b><h2 className={Styles.cardtitle} align="center" style={{ fontSize: '20px', fontWeight: 'bold' , marginBottom: '20px'}}>Nature of Entity</h2></b>
                  <div className={Styles.businesstypescontainer}>
                    <div className={Styles.businesstype} style={{ borderTop: '4px solid #6366F1' }}>
                      <div className={Styles.iconcontainer} style={{ backgroundColor: '#EEF2FF' }}>
                        <FaUsers style={{ color: '#6366F1', fontSize: '24px' }} />
                      </div>
                      <div className={Styles.amount} style={{ color: '#111827' }}>{getBusinessTypeCount(1)}</div>
                      <div className={Styles.typename} style={{ color: '#111827' }}>Limited Liability</div>
                      <div className={Styles.typename} style={{ color: '#111827' }}>Partnership</div>
                    </div>
                    
                    <div className={Styles.businesstype} style={{ borderTop: '4px solid #10B981' }}>
                      <div className={Styles.iconcontainer} style={{ backgroundColor: '#ECFDF5' }}>
                        <BsBuildingsFill style={{ color: '#10B981', fontSize: '24px' }} />
                      </div>
                      <div className={Styles.amount} style={{ color: '#111827' }}>{getBusinessTypeCount(2)}</div>
                      <div className={Styles.typename} style={{ color: '#111827' }}>Private Limited</div>
                      <div className={Styles.typename} style={{ color: '#111827' }}>Company</div>
                    </div>
                    
                    <div className={Styles.businesstype} style={{ borderTop: '4px solid #F59E0B' }}>
                      <div className={Styles.iconcontainer} style={{ backgroundColor: '#FFFBEB' }}>
                        <FaRegBuilding style={{ color: '#F59E0B', fontSize: '24px' }} />
                      </div>
                      <div className={Styles.amount} style={{ color: '#111827' }}>{getBusinessTypeCount(3)}</div>
                      <div className={Styles.typename} style={{ color: '#111827' }}>Registered</div>
                      <div className={Styles.typename} style={{ color: '#111827' }}>Partnership</div>
                    </div>
                    </div>
                    <p style={{fontSize:"12px",textAlign:"center"}}><b>Source: </b>Data on the Nature of Entity - Limited Liability Partnership, Private Limited Company, and Registered Partnership are from DPIIT (Startup India).</p>
                </div>
            </Grid>
                <Grid size={6}>
                  <StatusStartup />
                  <p style={{fontSize:"12px",textAlign:"center"}}><b>Source: </b>Data on the Status - Approved, Cancelled, and Expired are from DPIIT (Startup India).</p>
                 
                </Grid>
       </Grid>
                
       </div>
    </div>
    </div>
    
  );
}

export default HomePageCards;