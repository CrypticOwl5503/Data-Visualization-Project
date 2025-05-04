import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { csv } from 'd3-fetch';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const InfoPanel = styled.div`
  position: fixed;
  pointer-events: none;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  min-width: 180px;
  z-index: 1000;
  font-size: 15px;
  transition: top 0.1s ease, left 0.1s ease;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 0;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  margin-right: 5px;
`;

const ToggleButton = styled.button`
  background-color: ${props => props.active ? '#ccc' : '#fff'};
  padding: 8px 16px;
  border: 1px solid #bbb;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
`;

const colorScale = scaleQuantize()
  .domain([0, 20]) // Adjust as per your data
  .range([
    "#fff7fb",
    "#ece7f2",
    "#d0d1e6",
    "#a6bddb",
    "#74a9cf",
    "#3690c0",
    "#0570b0",
    "#045a8d"
  ]);

const CrimeRateMap = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [crimeType, setCrimeType] = useState('property_crime_rate');

  const geoUrl = "/data/NYC_neighborhoods.json";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await csv('/data/NYC_crime_rate.csv');
        const processed = data.map(d => ({
          ...d,
          property_crime_rate: +d.property_crime_rate,
          violent_crime_rate: +d.violent_crime_rate
        }));
        setCrimeData(processed);
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    };
    fetchData();
  }, []);

  const getCrimeRate = (geoId) => {
    const neighborhood = crimeData.find(d => d.Name === geoId);
    return neighborhood ? neighborhood[crimeType] : null;
  };

  const getNeighborhoodData = (geoId) =>
    crimeData.find(d => d.Geography === geoId || d.Name === geoId);

  const Tooltip = hovered && (() => {
    const n = getNeighborhoodData(hovered.geoId);
    if (!n) return null;
    return (
      <InfoPanel style={{ left: tooltipPos.x + 15, top: tooltipPos.y + 15 }}>
        <div><strong>{n.Name}</strong></div>
        <div>Property Crime Rate: {n.property_crime_rate}</div>
        <div>Violent Crime Rate: {n.violent_crime_rate}</div>
      </InfoPanel>
    );
  })();

  if (!crimeData.length) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading crime data...</div>;
  }

  return (
    <MapContainer>
      <h2>NYC Crime Rates by Neighborhood (2023)</h2>
      <p style={{ maxWidth: 800 }}>
        This map shows the spatial distribution of property and violent crime rates across New York City neighborhoods in 2023.
        You can toggle between crime types to explore different aspects of public safety.
      </p>

      <div style={{ margin: '20px 0' }}>
        <ToggleButton
          onClick={() => setCrimeType('property_crime_rate')}
          active={crimeType === 'property_crime_rate'}
        >
          Property Crime
        </ToggleButton>
        <ToggleButton
          onClick={() => setCrimeType('violent_crime_rate')}
          active={crimeType === 'violent_crime_rate'}
        >
          Violent Crime
        </ToggleButton>
      </div>

      <div style={{ position: 'relative', height: '900px' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 55000,
            center: [-73.94, 40.7]
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const geoId = geo.properties.cd_name;
                const rate = getCrimeRate(geoId);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={rate ? colorScale(rate) : "#EEE"}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    onMouseEnter={e => {
                      setHovered({ geoId });
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#ff4444', cursor: 'pointer' },
                      pressed: { outline: 'none' }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {Tooltip}
        <Legend>
          <h4 style={{ margin: 0, fontSize: '14px' }}>
            {crimeType.replace('_', ' ').toUpperCase()}
          </h4>
          {colorScale.range().map((color, i) => {
            const [min, max] = colorScale.invertExtent(color);
            return (
              <LegendItem key={i}>
                <LegendColor color={color} />
                <span>{Math.round(min)} - {Math.round(max)}</span>
              </LegendItem>
            );
          })}
        </Legend>
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Source: <a href="https://furmancenter.org/neighborhoods" target="_blank" rel="noopener noreferrer">
          Furman Center NYC Neighborhoods
        </a>
      </p>
    </MapContainer>
  );
};

export default CrimeRateMap;
