import React, { useEffect, useState } from 'react';
import { FaIndustry, FaChartPie, FaUsers, FaRegBuilding } from 'react-icons/fa';
import { HiMiniBuildingOffice } from "react-icons/hi2";
import { BsBuildingsFill } from "react-icons/bs";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import axios from 'axios';
import Styles from './css/HomePageCards.module.css';


const HomePageCards = () => {
  const [counts, setCounts] = useState({ startups: 0, industries: 0, sectors: 0 });
  const [businessTypes, setBusinessTypes] = useState([]);
  const [stageData, setStageData] = useState([]);
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

        // Fetch pie chart data
        const pieResponse = await axios.get('https://development.stieahub.in/Codigniter_api/public/natureofpiechart');
        setStageData(pieResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare pie chart data from API response
  const getPieData = () => {
    if (!stageData || stageData.length === 0) return [];
    
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    
    return stageData.map((item, index) => ({
      label: item.stage_name,
      value: parseInt(item.count),
      color: colors[index % colors.length]
    }));
  };

  const pieData = getPieData();

  const getPieArcLabel = (params) => {
    if (pieData.length === 0) return '0%';
    
    const TOTAL = pieData.map((item) => item.value).reduce((a, b) => a + b, 0);
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  // Function to get count for specific business type
  const getBusinessTypeCount = (value) => {
    const type = businessTypes.find(item => item.value === value.toString());
    return type ? type.count : '0';
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.cardRow}>
        <div className={Styles.statcard}> 
          <div className={Styles.cardheader} style={{ backgroundColor: '#3b669d', borderColor: '#3B82F6' }}>
            <HiMiniBuildingOffice className={Styles.cardicon} style={{ color: 'white' }} />
          </div>
          <div className={Styles.cardcontent}>
            <h3 className={Styles.cardtitle}>No. of Startups</h3>
            <p className={Styles.cardvalue}>{counts.startups}</p>
          </div>
        </div>

        <div className={Styles.statcard}>
          <div className={Styles.cardheader} style={{ backgroundColor: '#329a69', borderColor: '#10B981' }}>
            <FaIndustry className={Styles.cardicon} style={{ color: 'white' }} />
          </div>
          <div className={Styles.cardcontent}>
            <h3 className={Styles.cardtitle}>No. of Industries</h3>
            <p className={Styles.cardvalue}>{counts.industries}</p>
          </div>
        </div>

        <div className={Styles.statcard}>
          <div className={Styles.cardheader} style={{ backgroundColor: '#943735', borderColor: '#EF4444' }}>
            <FaChartPie className={Styles.cardicon} style={{ color: 'white' }} />
          </div>
          <div className={Styles.cardcontent}>
            <h3 className={Styles.cardtitle}>No. of Sectors</h3>
            <p className={Styles.cardvalue}>{counts.sectors}</p>
          </div>
        </div>
      </div>

      <div className={Styles.chartRow}>
        <div className={Styles.statcard}> 
            <h5>Stage of Startup</h5>
          {pieData.length > 0 ? (
            <PieChart
              series={[
                {
                  outerRadius: 150,
                  data: pieData,
                  arcLabel: getPieArcLabel,
                },
              ]}
              width={500}
              height={350}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: 'white',
                  fontSize: 20,
                },
              }}
              margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          ) : (
            <div className={Styles.loadingMessage}>Loading pie chart data...</div>
          )}
        </div>

        
      </div>

      {!loading && (
        <div className={Styles.chartRow}>
          <div className={Styles.statcard}> 
            <h5>Nature of Entity</h5>
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
          </div>
        </div>
      )}
      {/* <progress value={75} max={100} /> */}

      
    </div>
    
  );
}

export default HomePageCards;