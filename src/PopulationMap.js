import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { csv } from 'd3-fetch';
import styled from 'styled-components';

// US TopoJSON data
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// FIPS to state abbreviation mapping
const fipsToState = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA",
  "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL",
  "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN",
  "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME",
  "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS",
  "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND",
  "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT",
  "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI",
  "56": "WY"
};

const Slider = styled.input`
  width: 100%;
  margin: 20px 0;
`;

const MapContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  border-radius: 5px;
  font-size: 14px;
  pointer-events: none;
  transform: translate(-250%, -110%);
  display: ${({ visible }) => (visible ? "block" : "none")};
`;

const PopulationMap = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(1950);
  const [minYear, setMinYear] = useState(1950);
  const [maxYear, setMaxYear] = useState(1983);
  const [tooltip, setTooltip] = useState({ visible: false, state: "", population: 0, x: 0, y: 0 });

  useEffect(() => {
    const processData = async () => {
      try {
        const csvData = await csv('/data/population.csv');
        setData(csvData);
  
        const years = [...new Set(csvData.map(d => +d.year))];
        setMinYear(Math.min(...years));
        setMaxYear(Math.max(...years));
        setYear(Math.min(...years));
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };
  
    processData();
  }, []);

  // Create color scale
  const colorScale = scaleQuantize()
    .domain([0, 10000000])
    .range([
      "#e5f5f9",
      "#ccece6",
      "#99d8c9",
      "#66c2a4",
      "#41ae76",
      "#238b45",
      "#006d2c",
      "#00441b"
    ]);

  // Get population data for current year
  const getPopulation = (stateFips) => {
    const stateAbbr = fipsToState[stateFips]; // Convert FIPS to abbreviation
    if (!stateAbbr) return 0; // If no mapping found, return 0
  
    const stateData = data.find(d => d.state === stateAbbr && +d.year === year);
  
    return stateData ? +stateData.population : 0;
  };

  return (
    <MapContainer>
      <h2>US Population by State in {year}</h2>
      
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const stateFips = geo.id;
              const stateAbbr = fipsToState[stateFips];
              const population = getPopulation(stateFips);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(population)}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: '#F53' },
                    pressed: { outline: 'none' }
                  }}
                  onMouseEnter={(event) => {
                    setTooltip({
                      visible: true,
                      state: stateAbbr || "Unknown",
                      population: population.toLocaleString(),
                      x: event.clientX,
                      y: event.clientY
                    });
                  }}
                  onMouseMove={(event) => {
                    setTooltip(prev => ({
                      ...prev,
                      x: event.clientX,
                      y: event.clientY
                    }));
                  }}
                  onMouseLeave={() => {
                    setTooltip({ visible: false, state: "", population: 0, x: 0, y: 0 });
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      
      <div>
        <p>Year: {year}</p>
        <Slider
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={e => setYear(+e.target.value)}
        />
      </div>

      {/* Tooltip */}
      <Tooltip
        visible={tooltip.visible}
        style={{ top: tooltip.y, left: tooltip.x}}
      >
        <strong>{tooltip.state}</strong><br />
        Population: {tooltip.population}
      </Tooltip>
    </MapContainer>
  );
};

export default PopulationMap;
