import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { csv } from 'd3-fetch';
import styled from 'styled-components';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const Slider = styled.input`
  width: 100%;
  margin: 20px 0;
`;

const MapContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const MapSection = styled.div`
  flex: 1 1 600px;
`;

const LegendSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  margin: 2px 0;
`;

const raceLabels = {
  0: "Unknown or Not Specified",
  1: "White",
  2: "Black or African American",
  3: "American Indian or Alaska Native",
  4: "Asian",
  5: "Native Hawaiian or Other Pacific Islander",
  6: "Two or More Races"
};

const PopulationMapWithSliders = () => {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(2000);
  const [race, setRace] = useState(0);
  const [minYear, setMinYear] = useState(2000);
  const [maxYear, setMaxYear] = useState(2009);
  const [minRace, setMinRace] = useState(0);
  const [maxRace, setMaxRace] = useState(6);

  useEffect(() => {
    const processData = async () => {
      try {
        const csvData = await csv(process.env.PUBLIC_URL + "/data/population_by_race.csv");
        console.log("Loaded CSV Data:", csvData);
        setData(csvData);

        if (csvData.length > 0) {
          const years = Object.keys(csvData[0])
            .filter(key => key.startsWith("POPESTIMATE"))
            .map(key => +key.replace("POPESTIMATE", ""));

          setMinYear(Math.min(...years));
          setMaxYear(Math.max(...years));
        }
      } catch (error) {
        console.error("Error loading CSV:", error);
      }
    };

    processData();
  }, []);

  const filteredData = data.filter(d => Number(d.RACE) === Number(race));
  const maxPopulation = filteredData.length
  ? Math.max(
      ...filteredData.flatMap(d =>
        Object.keys(d)
          .filter(key => key.startsWith("POPESTIMATE"))
          .map(key => +d[key] || 0)
      )
    )
  : 1;


  const colorScale = scaleQuantize()
    .domain([0, maxPopulation / 50])
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

  const getPopulation = (stateId) => {
    const stateData = data.find(
      d => Number(d.STATE) === Number(stateId) && Number(d.RACE) === Number(race)
    );
    return stateData ? +stateData[`POPESTIMATE${year}`] || 0 : 0;
  };

  return (
    <MapContainer>
      <MapSection>
        <h2>US Population by State in {year}</h2>
        <h3>Race: {raceLabels[race]}</h3>

        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const population = getPopulation(geo.id);
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

        <div>
          <p>Race: {raceLabels[race]}</p>
          <Slider
            type="range"
            min={minRace}
            max={maxRace}
            value={race}
            onChange={e => setRace(+e.target.value)}
          />
        </div>
      </MapSection>

      <LegendSection>
        <h4>Population Scale</h4>
        {colorScale.range().map((color, i) => {
          const [min, max] = colorScale.invertExtent(color);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ColorBox color={color} />
              <span>{Math.round(min)} - {Math.round(max)}</span>
            </div>
          );
        })}
      </LegendSection>
    </MapContainer>
  );
};

export default PopulationMapWithSliders;
