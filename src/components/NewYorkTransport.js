import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { csv, json } from 'd3-fetch';

const TransportDensityMap = () => {
  const [taxiData, setTaxiData] = useState([]);
  const [geojson, setGeojson] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nycCenter = [-74.0060, 40.7128];
  const geoUrl = "/data/NYC_map_json.json";

  // Color scale for density visualization
  const colorScale = scaleQuantize()
    .domain([0, 20000]) // Adjust based on your max total_count
    .range([
      "#ffeda0", "#fed976", "#feb24c", "#fd8d3c",
      "#fc4e2a", "#e31a1c", "#bd0026", "#800026"
    ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transportData, geoData] = await Promise.all([
          csv('/data/taxi_data.csv'),
          json(geoUrl)
        ]);

        console.log("✅ Transport Data:", transportData.slice(0, 5));
        console.log("✅ GeoJSON Loaded:", geoData.features?.length || 0, "features");

        // Convert numeric fields
        const processedData = transportData.map(d => ({
          ...d,
          latitude: +d.latitude,
          longitude: +d.longitude,
          total_count: +d.total_count,
          pickup_count: +d.pickup_count,
          dropoff_count: +d.dropoff_count
        }));

        setTaxiData(processedData);
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

  if (loading) return <div className="flex items-center justify-center h-screen text-xl">Loading data...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-xl text-red-500">Error: {error}</div>;

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
        New York City Taxi Activity Density
      </h1>

      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
      Visualizing New York City taxi activity density, with markers representing pickup/dropoff counts. Data from 2023.

      </p>

      <div style={{ 
        display: 'flex', 
        flex: 1,
        gap: '20px',
        height: 'calc(100vh - 150px)'
      }}>

        
        <div style={{ flexGrow: 1, height: '100%', minWidth: 0 }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: nycCenter, scale: 55000 }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Base NYC map */}
            <Geographies geography={geojson}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                    strokeWidth={0.5}
                  />
                ))
              }
            </Geographies>

            {/* Taxi activity markers */}
            {taxiData.map((location, index) => (
              <Marker
                key={index}
                coordinates={[location.longitude, location.latitude]}
              >
                <circle
                  r={Math.sqrt(location.total_count) * 0.05} // Scale radius by activity
                  fill={colorScale(location.total_count)}
                  fillOpacity={0.7}
                  stroke="#fff"
                  strokeWidth={0.2}
                  onMouseEnter={(e) => {
                    setTooltip({
                      visible: true,
                      x: e.pageX,
                      y: e.pageY,
                      content: `
                        <strong>Location ID:</strong> ${location.LocationID}<br>
                        <strong>Total Activity:</strong> ${location.total_count}<br>
                        <strong>Pickups:</strong> ${location.pickup_count}<br>
                        <strong>Dropoffs:</strong> ${location.dropoff_count}
                      `
                    });
                  }}
                  onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
                />
              </Marker>
            ))}
          </ComposableMap>
        </div>

        {/* Legend */}
        <div style={{ 
          width: '220px', 
          padding: '20px', 
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            textAlign: 'center', 
            marginTop: '0',
            marginBottom: '20px',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            Activity Density Legend
          </h3>
          
          {colorScale.range().map((color, i) => {
            const [min, max] = colorScale.invertExtent(color);
            return (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '10px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: color,
                  marginRight: '10px',
                  borderRadius: '50%'
                }} />
                <span>
                  {Math.round(min)} - {Math.round(max)}
                </span>
              </div>
            );
          })}
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

<div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#555' }}>
  Data source: <a href="https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page" target="_blank" rel="noopener noreferrer" style={{ color: '#1e90ff' }}>
    NYC TLC Trip Record Data
  </a>
</div>

    </div>
  );
};

export default TransportDensityMap;
