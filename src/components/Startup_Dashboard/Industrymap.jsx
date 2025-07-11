import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import indiaTopoJson from './indiatopo.json';

const Industrymap = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [startupData, setStartupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://development.stieahub.in/Codigniter_api/public/industriescountstates'
        );
        const data = await response.json();
        setStartupData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStartupData([]);
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
    if (!stateName || !Array.isArray(startupData)) return null;
    return startupData.find(item => 
      item?.state_name?.toLowerCase() === stateName.toLowerCase()
    );
  };

  // Color mapping based on startup count ranges
  const getFillColor = (count) => {
    const num = count ? parseInt(count) : 0;
    
    if (num >= 2000) return '#4d88a5';       // Red for 2000+
    if (num >= 1000) return '#7aa54d';      // Coral for 1000-1999
    if (num >= 500) return '#7cef9d';       // Orange for 500-999
    if (num >= 100) return '#85338f';       // Gold for 100-499
    return '#8f3362';                       // Gray for <100 or no data
  };

  if (loading) return <div className="loading">Loading Industries map...</div>;

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
              const fillColor = getFillColor(stateData?.count);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredState({
                    name: stateName,
                    count: stateData?.count ? parseInt(stateData.count).toLocaleString() : 'No data',
                    industry: stateData?.top_industry || 'N/A'
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
                      fill: '#FF1493', // Hot pink on hover
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
        </div>
      )}

      {/* Enhanced Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        fontSize: '12px',
      }}>
        <h5 style={{ margin: '0 0 8px 0' }}>Industries Count</h5>
        {[
          { color: '#4d88a5', label: '2000+' },
          { color: '#7aa54d', label: '1000-1999' },
          { color: '#7cef9d', label: '500-999' },
          { color: '#85338f', label: '100-499' },
          { color: '#8f3362', label: '<100 or No data' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
            <div style={{
              width: '14px',
              height: '14px',
              backgroundColor: item.color,
              marginRight: '8px',
              borderRadius: '2px'
            }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Industrymap;