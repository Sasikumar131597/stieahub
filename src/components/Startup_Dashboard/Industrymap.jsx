// import React, { useState, useEffect } from 'react';
// import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
// // import indiaTopoJson from './indiatopo.json';
// import indiaTopoJson from './INDIA_STATES.json';

// const IndustryMap = () => {
//   const [hoveredState, setHoveredState] = useState(null);
//   const [industryData, setIndustryData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           'https://development.stieahub.in/Codigniter_api/public/industriescountstates'
//         );
//         const data = await response.json();
//         setIndustryData(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setIndustryData([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleMouseMove = (e) => {
//     setPosition({ x: e.clientX, y: e.clientY });
//   };

//   const getStateData = (stateName) => {
//     if (!stateName || !Array.isArray(industryData)) return null;
//     return industryData.find(item => 
//       item?.state_name?.toLowerCase() === stateName.toLowerCase()
//     );
//   };

//   // Color mapping based on top industry
//   const getIndustryColor = (industry) => {
//     if (!industry) return '#1d1616ff'; // Default color for no data
    
//     // Define a color palette for different industries
//     const industryColors = {
//       'it services': '#4d88a5',      
//       'healthcare': '#7aa54d',      
//       'food & beverages': '#85338f',         
//       'education': '#3a6862ff',      
//       'construction': '#ef7c4a',   
//       'agriculture': '#11752fff',     
//       'travel & tourism': '#4d4aefff',           
//     };

//     // Convert to lowercase for case-insensitive matching
//     const lowerIndustry = industry.toLowerCase();
    
//     // Check for exact matches first
//     if (industryColors[lowerIndustry]) {
//       return industryColors[lowerIndustry];
//     }

//     // Check for partial matches
//     for (const [key, color] of Object.entries(industryColors)) {
//       if (lowerIndustry.includes(key)) {
//         return color;
//       }
//     }

//     // Default color if no match found
//     return '#1d1616ff';
//   };

//   if (loading) return <div className="loading">Loading Industries map...</div>;

//   // Get unique industries for legend (using the actual industry names from data)
//   const uniqueIndustries = [...new Set(
//     industryData
//       .filter(item => item?.top_industry)
//       .map(item => item.top_industry)
//   )].slice(0, 8); // Limit to 8 industries for legend

//   return (
//     <div style={{ width: '100%', position: 'relative' }} onMouseMove={handleMouseMove}>
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{
//           scale: 1000,
//           center: [78.9629, 22.5937],
//         }}
//         width={800}
//         height={600}
//       >
//         <Geographies geography={indiaTopoJson}>
//           {({ geographies }) =>
//             geographies.map((geo) => {
//               const stateName = geo.properties.STNAME;
//               const stateData = getStateData(stateName);
//               const fillColor = getIndustryColor(stateData?.top_industry);
              
//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   onMouseEnter={() => setHoveredState({
//                     name: stateName,
//                     count: stateData?.count ? parseInt(stateData.count).toLocaleString() : 'No data',
//                     industry: stateData?.top_industry || 'N/A',
//                     color: fillColor
//                   })}
//                   onMouseLeave={() => setHoveredState(null)}
//                   style={{
//                     default: {
//                       fill: fillColor,
//                       outline: 'none',
//                       stroke: '#FFF',
//                       strokeWidth: 0.5,
//                     },
//                     hover: {
//                       fill: '#a9fa8aff', // Hot pink on hover
//                       outline: 'none',
//                     },
//                   }}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>

//       {/* Tooltip */}
//       {hoveredState && (
//         <div style={{
//           position: 'fixed',
//           left: `${Math.min(position.x + 15, window.innerWidth - 200)}px`,
//           top: `${position.y - 30}px`,
//           backgroundColor: 'white',
//           padding: '8px',
//           borderRadius: '4px',
//           boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
//           border: '1px solid #ddd',
//           pointerEvents: 'none',
//           zIndex: 100,
//         }}>
//           <strong>{hoveredState.name}</strong>
//           <div>Industries: {hoveredState.count}</div>
//           <div>Top Industry: {hoveredState.industry}</div>
//           <div style={{
//             display: 'inline-block',
//             width: '12px',
//             height: '12px',
//             backgroundColor: hoveredState.color,
//             marginRight: '5px',
//             verticalAlign: 'middle'
//           }}></div>
//         </div>
//       )}

//       {/* Industry Legend */}
//       <div style={{
//         position: 'absolute',
//         top: '10px',
//         // left: '10px',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         padding: '10px',
//         borderRadius: '5px',
//         boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//         fontSize: '12px',
//         maxWidth: '150px'
//       }}>
//         <h6 style={{ margin: '0 0 8px 0', textAlign: 'center' }}>Top Industries</h6>
//         {Object.entries({
//           'IT Services': '#4d88a5',      
//           'Healthcare': '#7aa54d',      
//           'Food & Beverages': '#85338f',         
//           'Education': '#3a6862ff',      
//           'Construction': '#ef7c4a',   
//           'Agriculture': '#11752fff',     
//           'Travel & Tourism': '#4d4aefff',
//           'No Data': '#1d1616ff'           
//         }).map(([industry, color]) => (
//           <div key={industry} style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
//             <div style={{
//               width: '14px',
//               height: '14px',
//               backgroundColor: color,
//               marginRight: '8px',
//               borderRadius: '2px'
//             }} />
//             <span>{industry}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default IndustryMap;


import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import indiaTopoJson from './INDIA_STATES.json';

const IndustryMap = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [industryData, setIndustryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [maxCount, setMaxCount] = useState(1);

  const normalize = (str) => str?.toLowerCase().trim().replace(/\s+/g, '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://development.stieahub.in/Codigniter_api/public/industriescountstates'
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setIndustryData(data);
          const max = Math.max(...data.map(item => parseInt(item.count || 0)), 1);
          setMaxCount(max);
        } else {
          setIndustryData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIndustryData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const getStateData = (stateName) => {
    const normalizedName = normalize(stateName);
    if (normalizedName.includes('lakshadweep') || normalizedName.includes('ld')) {
      return industryData.find(item => 
        normalize(item.state_name).includes('lakshadweep') || 
        normalize(item.state_name).includes('ld')
      );
    }
    if (normalizedName.includes('andaman') || normalizedName.includes('nicobar')) {
      return industryData.find(item => 
        normalize(item.state_name).includes('andaman') || 
        normalize(item.state_name).includes('nicobar')
      );
    }
    return industryData.find(item => normalize(item.state_name) === normalizedName);
  };

  // Get green color based on count intensity
  const getColorForCount = (count) => {
    // if (count === 0) return '#f0f0f0'; // Light gray for no data
    // const intensity = Math.min(0.2 + (count / maxCount) * 0.8, 1);
    // // Green gradient from light to dark
    // const hue = 120; // Green hue
    // const saturation = 80; // 80% saturation
    // const lightness = 100 - (intensity * 60); // Vary lightness from 100% to 40%
    // return `hsl(${hue}, ${saturation}%, ${lightness}%)`;


  // Define your custom HEX color gradient
  const colorGradient = [
    '#99e699',
    '#70db70',
    '#47d147',
    '#2eb82e',
    '#239023',
    '#196619'   // darkest green
  ];

  if (count === 0) return colorGradient[0];
  
  // Calculate index based on count/maxCount ratio
  const index = Math.min(
    Math.ceil((count / maxCount) * (colorGradient.length - 1)),
    colorGradient.length - 1
  );
  
  return colorGradient[index];
  };

  const getStateStyle = (count, stateName) => {
    const normalizedName = normalize(stateName);
    const isIsland = normalizedName.includes('lakshadweep') || 
                    normalizedName.includes('andaman') || 
                    normalizedName.includes('nicobar');
    const fillColor = getColorForCount(count);
    
    return {
      default: {
        fill: fillColor,
        stroke: isIsland ? '#9acc95ff' : '#FFFFFF',
        strokeWidth: isIsland ? 1.5 : 0.8,
        outline: 'none'
      },
      hover: {
        fill: fillColor,
        stroke: isIsland ? '#8bc79cff' : '#1a064a',
        strokeWidth: isIsland ? 2.5 : 2,
        filter: isIsland 
          ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.7))' 
          : 'drop-shadow(0 0 6px rgba(26, 6, 74, 0.5))',
        transition: 'all 100ms'
      }
    };
  };

  if (loading) return <div className="loading">Loading Industries map...</div>;

  return (
    <div style={{ width: '100%', position: 'relative' }} onMouseMove={handleMouseMove}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [78.9629, 22.5937],
          precision: 0.1
        }}
        width={800}
        height={600}
        style={{
          backgroundColor: '#f0f0f0'
        }}
      >
        {/* Main India Map */}
        <Geographies geography={indiaTopoJson}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const rawName = geo?.properties?.STNAME || 'Unknown';
              const stateName = rawName;
              const stateData = getStateData(stateName);
              const count = parseInt(stateData?.count || 0);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredState({
                    name: stateName,
                    count: count.toLocaleString(),
                    industry: stateData?.top_industry || 'N/A',
                    color: getColorForCount(count)
                  })}
                  onMouseLeave={() => setHoveredState(null)}
                  style={getStateStyle(count, stateName)}
                />
              );
            })
          }
        </Geographies>

        {/* Island Territories */}
        <Geographies geography={indiaTopoJson}>
          {({ geographies }) =>
            geographies
              .filter(geo => {
                const name = normalize(geo?.properties?.STNAME || '');
                return name.includes('lakshadweep') || name.includes('andaman') || name.includes('nicobar');
              })
              .map((geo) => {
                const stateName = geo?.properties?.STNAME || 'Island Territory';
                const stateData = getStateData(stateName);
                const count = parseInt(stateData?.count || 0);
                
                return (
                  <Geography
                    key={`island-${geo.rsmKey}`}
                    geography={geo}
                    onMouseEnter={() => setHoveredState({
                      name: stateName,
                      count: count.toLocaleString(),
                      industry: stateData?.top_industry || 'N/A',
                      color: getColorForCount(count)
                    })}
                    onMouseLeave={() => setHoveredState(null)}
                    style={getStateStyle(count, stateName)}
                  />
                );
              })
          }
        </Geographies>
      </ComposableMap>

      {/* Color Gradient Scale (Legend) */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '200px'
      }}>
        <div style={{ 
          marginBottom: '8px', 
          fontWeight: 'bold', 
          color: '#1a064a',
          fontSize: '14px'
        }}>
          Number of Industries
        </div>
        
        {/* Gradient Bar */}
        <div style={{
          display: 'flex',
          width: '100%',
          height: '20px',
          marginBottom: '8px',
          background: 'linear-gradient(to right, #73c268ff, hsla(120, 87%, 31%, 1.00))',
          borderRadius: '3px'
        }}/>
        
        {/* Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          fontSize: '12px'
        }}>
          <span>0</span>
          <span>{maxCount}</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredState && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(position.x + 15, window.innerWidth - 200),
            top: position.y - 30,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            border: `2px solid ${
              normalize(hoveredState.name).includes('lakshadweep') || 
              normalize(hoveredState.name).includes('andaman') || 
              normalize(hoveredState.name).includes('nicobar') 
                ? '#3a3636ff' 
                : '#1a064a'
            }`,
            pointerEvents: 'none',
            zIndex: 100,
            minWidth: '160px',
            color: '#333',
            fontSize: '13px'
          }}
        >
          <strong style={{ color: '#1a064a' }}>
            {hoveredState.name}
          </strong>
          <div>
            Start up count: <strong>{hoveredState.count}</strong>
          </div>
          <div>
            Top Industry: <strong>{hoveredState.industry}</strong>
          </div>
          <div style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            backgroundColor: hoveredState.color,
            marginRight: '5px',
            verticalAlign: 'middle'
          }}></div>
        </div>
      )}
    </div>
  );
};

export default IndustryMap;