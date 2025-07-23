import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import indiaTopoJson from './INDIA_STATES.json';

const Startupmap = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [startupData, setStartupData] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [maxCount, setMaxCount] = useState(1);

  const normalize = (str) => str?.toLowerCase().trim().replace(/\s+/g, '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://development.stieahub.in/Codigniter_api/public/startupscountstates');
        const data = await res.json();
        if (Array.isArray(data)) {
          setStartupData(data);
          const max = Math.max(...data.map(item => parseInt(item.count || 0)), 1);
          setMaxCount(max);
        } else {
          setStartupData([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStateData = (stateName) => {
    const normalizedName = normalize(stateName);
    if (normalizedName.includes('lakshadweep') || normalizedName.includes('ld')) {
      return startupData.find(item => 
        normalize(item.state_name).includes('lakshadweep') || 
        normalize(item.state_name).includes('ld')
      );
    }
    if (normalizedName.includes('andaman') || normalizedName.includes('nicobar')) {
      return startupData.find(item => 
        normalize(item.state_name).includes('andaman') || 
        normalize(item.state_name).includes('nicobar')
      );
    }
    return startupData.find(item => normalize(item.state_name) === normalizedName);
  };

  const getColorForCount = (count) => {
    if (count === 0) return '#f0f0f0';
    const intensity = Math.min(0.2 + (count / maxCount) * 0.8, 1);
    return `rgba(26, 6, 74, ${intensity})`;
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
        stroke: isIsland ? '#824388ff' : '#FFFFFF',
        strokeWidth: isIsland ? 1.5 : 0.8,
        outline: 'none'
      },
      hover: {
        fill: fillColor,
        stroke: isIsland ? '#000000ff' : '#1a064a',
        strokeWidth: isIsland ? 2.5 : 2,
        filter: isIsland 
          ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.7))' 
          : 'drop-shadow(0 0 6px rgba(26, 6, 74, 0.5))',
        transition: 'all 100ms'
      }
    };
  };

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  if (loading) return <div>Loading startup map...</div>;

  return (
    <div onMouseMove={handleMouseMove} style={{ position: 'relative', width: '100%' }}>
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
                  onMouseEnter={() => setHoveredState({ name: stateName, count })}
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
                    onMouseEnter={() => setHoveredState({ name: stateName, count })}
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
          Number of Startups
        </div>
        
        {/* Gradient Bar */}
        <div style={{
          display: 'flex',
          width: '100%',
          height: '20px',
          marginBottom: '8px',
          background: 'linear-gradient(to right, #f0f0f0, rgba(26, 6, 74, 1))',
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
          <strong style={{ 
            color: '#1a064a'
          }}>
            {hoveredState.name}
          </strong>
          <div>
            Startups: <strong>{hoveredState.count ? hoveredState.count.toLocaleString() : 'No data'}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default Startupmap;
