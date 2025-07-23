import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import indiaTopoJson from './indiatopo.json';

const SectorMap = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [industryData, setIndustryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://development.stieahub.in/Codigniter_api/public/sectorscountstates'
        );
        const data = await response.json();
        setIndustryData(Array.isArray(data) ? data : []);
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
    if (!stateName || !Array.isArray(industryData)) return null;
    return industryData.find(item => 
      item?.state_name?.toLowerCase() === stateName.toLowerCase()
    );
  };

  // Color mapping based on top sector
  const getSectorColor = (sector) => {
    if (!sector) return '#1d1616ff'; // Default color for no data
    
    // Define a color palette for different sectors
    const sectorColors = {
      'construction & engineering': '#d5b172',
      'agriculture': '#7aa54d',
      'pharmaceutical': '#85338f',
      'health & wellness': '#3a6862ff',
      'business support services': '#ef7c4a',
      'manufacturing': '#11752fff',
      'product development': '#4d4aefff',
      'application development': '#ff6b6b',
      'experiential travel': '#9c27b0',
      'food processing': '#ff9800',
      'organic agriculture': '#4caf50',
      'it consulting': '#7a6068ff',
      'No Data': '#1d1616ff'
    };

    // Convert to lowercase for case-insensitive matching
    const lowerSector = sector.toLowerCase();
    
    // Check for exact matches first
    if (sectorColors[lowerSector]) {
      return sectorColors[lowerSector];
    }

    // Check for partial matches
    for (const [key, color] of Object.entries(sectorColors)) {
      if (lowerSector.includes(key)) {
        return color;
      }
    }

    // Default color if no match found
    return '#1d1616ff';
  };

  if (loading) return <div className="loading">Loading Sector map...</div>;

  return (
    <div style={{ width: '100%', position: 'relative' }} onMouseMove={handleMouseMove}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [78.9629, 22.5937],
        }}
        width={800}
        height={600}
      >
        <Geographies geography={indiaTopoJson}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName = geo.properties.st_nm;
              const stateData = getStateData(stateName);
              const fillColor = getSectorColor(stateData?.top_sector);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredState({
                    name: stateName,
                    count: stateData?.count ? parseInt(stateData.count).toLocaleString() : 'No data',
                    industry: stateData?.industty || 'N/A',
                    topSector: stateData?.top_sector || 'N/A',
                    color: fillColor
                  })}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{
                    default: {
                      fill: fillColor,
                      outline: 'none',
                      stroke: '#FFF',
                      strokeWidth: 0.5,
                    },
                    hover: {
                      fill: '#a9fa8aff',
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {hoveredState && (
        <div style={{
          position: 'fixed',
          left: `${Math.min(position.x + 15, window.innerWidth - 200)}px`,
          top: `${position.y - 30}px`,
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          border: '1px solid #ddd',
          pointerEvents: 'none',
          zIndex: 100,
        }}>
          <strong>{hoveredState.name}</strong>
          <div>Startups: {hoveredState.count}</div>
          <div>Top Industry: {hoveredState.industry}</div>
          <div>Top Sector: {hoveredState.topSector}</div>
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

      {/* Sector Legend */}
      <div style={{
        position: 'absolute',
        top: '10px',
        // left: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        fontSize: '12px',
        maxWidth: '150px',
        // maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <h6 style={{ margin: '0 0 8px 0', textAlign: 'center' }}>Top Sectors</h6>
        {Object.entries({
          'Construction & Engineering': '#d5b172',
          'Agriculture': '#7aa54d',
          'Pharmaceutical': '#85338f',
          'Health & Wellness': '#3a6862ff',
          'Business Support Services': '#ef7c4a',
          'Manufacturing': '#11752fff',
          'Product Development': '#4d4aefff',
          'Application Development': '#ff6b6b',
          'Experiential Travel': '#9c27b0',
          'Food Processing': '#ff9800',
          'Organic Agriculture': '#4caf50',
          'IT Consulting': '#7a6068ff',
          'No Data': '#1d1616ff'
        }).map(([sector, color]) => (
          <div key={sector} style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
            <div style={{
              width: '14px',
              height: '14px',
              backgroundColor: color,
              marginRight: '8px',
              borderRadius: '2px'
            }} />
            <span>{sector}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorMap;


