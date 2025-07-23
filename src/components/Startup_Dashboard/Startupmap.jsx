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

  // Enhanced color calculation with #4718b9 base color
  const getHeatColor = (count) => {
    if (!count) return '#F5F0FA'; // Very light purple for no data
    
    const num = parseInt(count);
    const maxCount = 20000;
    
    // Opacity range from 0.3 to 1.0
    const opacity = Math.min(0.3 + (num / maxCount * 0.7), 1.0).toFixed(2);
    
    return `rgba(71, 24, 185, ${opacity})`; // #4718b9 with varying opacity
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
              const count = stateData?.count ? parseInt(stateData.count) : 0;
              const fillColor = getHeatColor(count);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoveredState({
                    id: geo.id,
                    name: stateName,
                    count: count ? count.toLocaleString() : 'No data'
                  })}
                  onMouseLeave={() => setHoveredState(null)}
                  style={{
                    default: {
                      fill: fillColor,
                      outline: 'none',
                      stroke: '#FFF',
                      strokeWidth: 0.5,
                      transition: 'all 0.3s ease'
                    },
                    hover: {
                      fill: fillColor, // Same color
                      outline: 'none',
                      stroke: '#FFF',
                      strokeWidth: 2,
                      filter: 'drop-shadow(0 0 4px rgba(71, 24, 185, 0.5))'
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
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            border: '1px solid #ddd',
            pointerEvents: 'none',
            zIndex: 100,
            minWidth: '160px',
            maxWidth: '200px',
            backdropFilter: 'blur(2px)',
            color: '#333'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#4718b9' }}>
            {hoveredState.name}
          </div>
          <div>
            Startups: <strong>{hoveredState.count}</strong>
          </div>
        </div>
      )}

      {/* Enhanced Legend */}
      <div style={{
        position: 'absolute',
        top: '0px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        border: '1px solid #eee',
        backdropFilter: 'blur(2px)'
      }}>
        <h6 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '14px', 
          fontWeight: '600'
        }}>
          Startup Counts
        </h6>
        {[
          { color: 'rgba(71, 24, 185, 1)', label: 'High (15,000+)' },
          { color: 'rgba(71, 24, 185, 0.7)', label: 'Medium (10,000+)' },
          { color: 'rgba(71, 24, 185, 0.5)', label: 'Low (5,000+)' },
          { color: 'rgba(71, 24, 185, 0.3)', label: 'Very Low (<5,000)' },
          { color: '#F5F0FA', label: 'No data' },
        ].map((item, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '6px 0',
            padding: '4px 6px',
            borderRadius: '3px',
            backgroundColor: i === 4 ? 'rgba(0,0,0,0.03)' : 'transparent'
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              backgroundColor: item.color,
              marginRight: '10px',
              borderRadius: '3px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }} />
            <span style={{ fontSize: '13px', color: '#333' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Startupmap;


