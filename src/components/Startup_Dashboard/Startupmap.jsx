import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import indiaTopoJson from './indiatopo.json';

const Startupmap = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [startupData, setStartupData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Safe name normalization
  const normalizeName = (name) => {
    if (!name) return '';
    return name.toString().toLowerCase().trim();
  };

  // Fetch startup data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://development.stieahub.in/Codigniter_api/public/startupscountstates'
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

  // Track mouse position for tooltip
  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  // Get startup data for a state with safe access
  const getStateData = (stateName) => {
    if (!stateName || !Array.isArray(startupData)) return null;
    const normalized = normalizeName(stateName);
    return startupData.find(item => 
      item?.state_name && normalizeName(item.state_name) === normalized
    );
  };

  if (loading) return <div className="loading">Loading startup map...</div>;

  return (
    <div 
      style={{ width: '100%', position: 'relative' }}
      onMouseMove={handleMouseMove}
    >
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
              const stateName = geo?.properties?.st_nm || 'Unknown State';
              const stateData = getStateData(stateName);
              // const isHovered = hoveredState?.id === geo.id;
              
              // Default color if no data
              let fillColor = '#EAEAEC';
              
              if (stateData?.count) {
                const count = parseInt(stateData.count);
                fillColor = count > 20000 ? '#FF6B6B' :
                          count > 10000 ? '#FFA07A' :
                          count > 5000 ? '#7FB3D5' : '#82CAAF';
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredState({
                    id: geo.id,
                    name: stateName,
                    count: stateData?.count 
                      ? parseInt(stateData.count).toLocaleString() 
                      : 'No data'
                  })}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{
                    default: {
                      fill: fillColor,
                      outline: 'none',
                      stroke: '#FFF',
                      strokeWidth: 0.5,
                      opacity: 0.9
                    },
                    hover: {
                      fill: '#FF5252',
                      outline: 'none',
                      stroke: '#FFF',
                      strokeWidth: 1,
                    },
                    pressed: {
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Floating Tooltip */}
      {hoveredState && (
        <div
          style={{
            position: 'fixed',
            left: `${Math.min(position.x + 15, window.innerWidth - 200)}px`,
            top: `${position.y - 30}px`,
            backgroundColor: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            border: '1px solid #ddd',
            pointerEvents: 'none',
            zIndex: 100,
            minWidth: '160px',
            maxWidth: '200px',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {hoveredState.name}
          </div>
          <div>
            Startups: <strong>{hoveredState.count}</strong>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}>
        <h6 style={{ margin: '0 0 8px 0' }}>Startup Counts</h6>
        {[
          { color: '#FF6B6B', label: '20,000+' },
          { color: '#FFA07A', label: '10,000+' },
          { color: '#7FB3D5', label: '5,000+' },
          { color: '#82CAAF', label: '<5,000' },
          { color: '#EAEAEC', label: 'No data' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: item.color,
              marginRight: '8px',
              borderRadius: '2px'
            }} />
            <span style={{ fontSize: '13px' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Startupmap;


