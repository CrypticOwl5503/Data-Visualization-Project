import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Line, Annotation } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { csv } from 'd3-fetch';
import { Slider, Divider } from 'antd';
import 'antd/dist/reset.css';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #fafbfc;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const SliderContainer = styled.div`
  width: 80%;
  margin: 20px auto;
  padding: 0 20px;
`;

const InfoPanel = styled.div`
  position: fixed;
  pointer-events: none;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  min-width: 200px;
  z-index: 1000;
  font-size: 15px;
  border-left: 4px solid ${props => props.isPredicted ? '#ff9800' : '#41ab5d'};
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 3px 0;
  font-size: 13px;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  background: ${props => props.color};
  margin-right: 8px;
  border-radius: 3px;
  ${props => props.isPredicted && 'border: 1px dashed #ff9800;'}
`;

const PredictionBadge = styled.div`
  display: inline-block;
  background: #ff9800;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-left: 10px;
  font-weight: 500;
`;

// Enhanced color scale for better visualization
const colorScale = scaleQuantize()
  .domain([100, 8000])
  .range([
    "#f7fcf5",
    "#e5f5e0",
    "#c7e9c0",
    "#a1d99b",
    "#74c476",
    "#41ab5d",
    "#238b45",
    "#005a32"
  ]);

const HousingPriceMap = () => {
  const [housingData, setHousingData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1975);
  const [years, setYears] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const geoUrl = "/data/NYC_neighborhoods.json";
  const isPredictedYear = selectedYear > 2024;

  useEffect(() => {
    const fetchData = async () => {
      const data = await csv('/data/housing_forecast.csv');
      const processed = data.map(d => {
        const obj = {
          base_year: d.base_year,
          cd: d.cd,
          geo_name: d.geo_name,
          geo_level: d.geo_level
        };
        Object.keys(d).forEach(key => {
          if (!isNaN(key)) obj[key] = +d[key];
        });
        return obj;
      });
      setHousingData(processed);

      // Find all years, filter to 5-year steps
      const yearList = Object.keys(processed[0])
        .filter(k => !isNaN(k))
        .map(Number)
        .sort((a, b) => a - b)
        .filter(y => (y - processed[0].base_year) % 5 === 0);
      setYears(yearList);
      setSelectedYear(yearList[0]);
    };
    fetchData();
  }, []);

  const getPriceIndex = (cd) => {
    const n = housingData.find(d => d.cd === cd);
    return n ? n[selectedYear] : null;
  };

  const getNeighborhoodData = (cd) => housingData.find(d => d.cd === cd);

  // Tooltip content
  const Tooltip = hovered && (() => {
    const n = getNeighborhoodData(hovered.cd);
    if (!n) return null;
    const value = n[selectedYear];
    const isPredicted = selectedYear > 2024;
    
    return (
      <InfoPanel 
        style={{ left: tooltipPos.x + 15, top: tooltipPos.y + 15 }}
        isPredicted={isPredicted}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <strong>{n.geo_name}</strong>
          {isPredicted && <small style={{ color: '#ff9800', fontStyle: 'italic' }}>Predicted</small>}
        </div>
        <Divider style={{ margin: '8px 0' }} />
        <div>Price Index: <strong>{value ? value.toFixed(0) : "N/A"}</strong></div>
        <div>Change since 1975: <strong>{value ? (value - 100).toFixed(1) : "N/A"}%</strong></div>
        {selectedYear > 1975 && value &&
          <div>
            Annual growth: <strong>{((Math.pow(value / 100, 1 / (selectedYear - 1975)) - 1) * 100).toFixed(2)}%</strong>
          </div>
        }
      </InfoPanel>
    );
  })();

  return (
    <MapContainer>
      <Header>
        <h2>
          NYC Housing Price Index by Neighborhood ({selectedYear})
          {isPredictedYear && <PredictionBadge>Predicted Data</PredictionBadge>}
        </h2>
        <p>Base Year: 1975 (Index = 100)</p>
      </Header>
      
      <SliderContainer>
        {years.length > 0 && (
          <Slider
            min={Math.min(...years)}
            max={Math.max(...years)}
            value={selectedYear}
            onChange={setSelectedYear}
            marks={years.reduce((acc, y) => { 
              acc[y] = {
                style: {
                  color: y > 2024 ? '#ff9800' : undefined,
                  fontWeight: y > 2024 ? 'bold' : undefined
                },
                label: y > 2024 ? `${y}*` : y.toString()
              };
              return acc; 
            }, {})}
            step={null}
            tooltip={{ open: true, formatter: (value) => value > 2024 ? `${value} (Predicted)` : value }}
            railStyle={{ backgroundColor: '#e5e5e5', height: 8 }}
            trackStyle={{ backgroundColor: isPredictedYear ? '#ff9800' : '#41ab5d', height: 8 }}
            handleStyle={{
              borderColor: isPredictedYear ? '#ff9800' : '#41ab5d',
              backgroundColor: '#fff',
              height: 20,
              width: 20,
              marginTop: -6
            }}
          />
        )}
        {years.some(y => y > 2024) && (
          <div style={{ textAlign: 'right', marginTop: 5, color: '#ff9800', fontStyle: 'italic' }}>
            * Predicted data
          </div>
        )}
      </SliderContainer>
      
      <div style={{ position: 'relative', height: '1000px', border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden' }}>
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
                const cd = geo.properties.cd;
                const priceIndex = getPriceIndex(cd);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={priceIndex ? colorScale(priceIndex) : "#EEE"}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    strokeOpacity={isPredictedYear ? 0.7 : 1}
                    fillOpacity={isPredictedYear ? 0.85 : 1}
                    style={{
                      default: { outline: 'none' },
                      hover: { 
                        outline: 'none', 
                        fill: isPredictedYear ? '#ffab40' : '#ff4444', 
                        cursor: 'pointer',
                        stroke: '#000',
                        strokeWidth: 1
                      },
                      pressed: { outline: 'none' }
                    }}
                    onMouseEnter={e => {
                      setHovered({ cd });
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })
            }
          </Geographies>
          
          {isPredictedYear && (
            <Annotation
              subject={[-73.94, 40.85]}
              dx={-90}
              dy={-30}
              connectorProps={{
                stroke: "#ff9800",
                strokeWidth: 2,
                strokeDasharray: "5,5"
              }}
            >
              <text x="-8" textAnchor="end" alignmentBaseline="middle" fill="#ff9800">
                Predicted Data
              </text>
            </Annotation>
          )}
        </ComposableMap>
        
        {Tooltip}
        
        <Legend>
          <h4 style={{ marginTop: 0, marginBottom: 8 }}>Price Index</h4>
          {colorScale.range().map((color, i) => {
            const [min, max] = colorScale.invertExtent(color);
            return (
              <LegendItem key={i}>
                <LegendColor 
                  color={color} 
                  isPredicted={isPredictedYear}
                />
                <span>{Math.round(min)} - {Math.round(max)}</span>
              </LegendItem>
            );
          })}
          {isPredictedYear && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#ff9800', fontStyle: 'italic' }}>
              * Values after 2024 are predicted
            </div>
          )}
        </Legend>
      </div>
    </MapContainer>
  );
};

export default HousingPriceMap;
