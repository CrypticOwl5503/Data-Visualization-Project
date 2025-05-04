import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { csv, json } from 'd3-fetch';

const NewYorkPopulationMap = () => {
  const [data, setData] = useState([]);
  const [geojson, setGeojson] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDemographic, setSelectedDemographic] = useState('Income');

  const demographicOptions = [
    { value: 'Income', label: 'Income($)' }
  ];
  

  const nycCenter = [-74.0060, 40.7128];
  const geoUrl = "/data/NYC_map_json.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [csvData, geoData] = await Promise.all([
          csv('/data/nyc_data.csv'),
          json(geoUrl)
        ]);

        console.log("✅ CSV Loaded:", csvData.slice(0, 5));
        console.log("✅ GeoJSON Loaded:", geoData.features?.length || 0, "features");

        setData(csvData);
        setGeojson(geoData);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error loading data:", error);
        setError(`Failed to load data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading map data...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-xl text-red-500">Error: {error}</div>;
  if (!geojson) return <div className="flex items-center justify-center h-screen text-xl">No geographic data available</div>;

  // Get the max value for the current demographic
  const maxValue = Math.max(...data.map(d => +d[selectedDemographic] || 0));
  
  // Create color scale based on the current demographic
  const colorScale = scaleQuantize()
    .domain([0, maxValue])
    .range([
      "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d",
      "#238b45", "#006d2c", "#00441b", "#002d13"
    ]);

  const getPopulationValue = (geoId) => {
    if (!geoId) return null;

    const formats = [
      geoId,
      geoId.toString(),
      geoId.toString().padStart(11, '0'),
      geoId.toString().replace(/^0+/, '')
    ];

    for (const format of formats) {
      const match = data.find(d => {
        const censusTract = d.CensusTract?.toString();
        return censusTract === format ||
          censusTract?.padStart(11, '0') === format ||
          censusTract?.replace(/^0+/, '') === format.replace(/^0+/, '');
      });

      if (match) return {
        value: +match[selectedDemographic],
        census: match
      };
    }

    return null;
  };

  const handleDemographicChange = (event) => {
    setSelectedDemographic(event.target.value);
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '10px' 
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '2rem', 
        margin: '10px 0 20px', 
        fontWeight: 'bold' 
      }}>
        New York {demographicOptions.find(d => d.value === selectedDemographic).label} by Census Tract
      </h1>

      {/* Demographic Selector */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '20px',
        alignItems: 'center',
        gap: '15px'
      }}>
        <label htmlFor="demographic-select" style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Select Demographic:
        </label>
        <select 
          id="demographic-select"
          value={selectedDemographic}
          onChange={handleDemographicChange}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
            backgroundColor: '#f8f8f8',
            cursor: 'pointer'
          }}
        >
          {demographicOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ 
        display: 'flex', 
        flex: 1,
        gap: '20px',
        height: 'calc(100vh - 150px)'
      }}>
        {/* Map container - takes up most of the space */}
        <div style={{ flexGrow: 1, height: '100%', minWidth: 0 }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: nycCenter, scale: 55000 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Geographies geography={geojson}>
              {({ geographies }) => {
                let matched = 0;

                const elements = geographies.map(geo => {
                  const geoId = geo.properties?.GEOID;
                  const populationData = getPopulationValue(geoId);
                  const populationValue = populationData?.value;

                  if (populationValue) matched++;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={populationValue ? colorScale(populationValue) : '#EEE'}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      onMouseEnter={(e) => {
                        const census = populationData?.census;
                        let content = `${geo.properties.NAME || 'Region'}: ${populationValue?.toLocaleString() || 'No data'}`;
                        
                        if (census) {
                          content += `<br>Borough: ${census.Borough}`;
                          if (selectedDemographic === 'TotalPop') {
                            content += `<br>Men: ${(+census.Men).toLocaleString()}`;
                            content += `<br>Women: ${(+census.Women).toLocaleString()}`;
                          }
                        }
                        
                        setTooltip({
                          visible: true,
                          x: e.pageX,
                          y: e.pageY,
                          content: content
                        });
                      }}
                      onMouseLeave={() => {
                        setTooltip(prev => ({ ...prev, visible: false }));
                      }}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: '#F53' },
                        pressed: { outline: 'none' }
                      }}
                    />
                  );
                });

                console.log(`✅ Matched regions: ${matched}/${geographies.length}`);
                return elements;
              }}
            </Geographies>
          </ComposableMap>
        </div>

        {/* Legend positioned on the right side */}
        <div style={{ 
          width: '220px', 
          padding: '20px', 
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ 
            textAlign: 'center', 
            marginTop: '0',
            marginBottom: '20px',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            {demographicOptions.find(d => d.value === selectedDemographic).label} Legend
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            flex: 1
          }}>
            {colorScale.range().map((color) => {
              const [min, max] = colorScale.invertExtent(color);
              const label = `${Math.round(min).toLocaleString()} - ${Math.round(max).toLocaleString()}`;
              return (
                <div key={color} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px' 
                }}>
                  <div style={{ 
                    width: 30, 
                    height: 30, 
                    backgroundColor: color, 
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }} />
                  <div style={{ fontSize: '14px' }}>{label}</div>
                </div>
              );
            })}
          </div>

          <div style={{ 
            marginTop: "30px", 
            fontSize: '14px',
            borderTop: '1px solid #ddd',
            paddingTop: '20px'
          }}>
            <p><strong>Data Records:</strong> {data.length.toLocaleString()}</p>
            <p><strong>Geographic Regions:</strong> {(geojson.features?.length || 0).toLocaleString()}</p>
            <p><strong>Max Value:</strong> {maxValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {tooltip.visible && (
        <div
            style={{
            position: 'absolute',
            background: 'white',
            border: '1px solid #ddd',
            padding: '12px',
            borderRadius: '6px',
            pointerEvents: 'none',
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            fontSize: '14px',
            maxWidth: '250px'
            }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
        )}

    </div>
  );
};

export default NewYorkPopulationMap;