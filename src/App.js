import './App.css';
import React, { useState } from "react";
import { 
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent 
} from "@material-ui/core";
import { useEffect } from 'react';
import { InfoBox } from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData } from './util.js';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

// STATE => How to write a variable in React
// useEffect => Runs a piece of code based on a given condition

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746, lng: -40.4796
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  // https://api.caw.sh/v3/covid-19/countries


  
  useEffect(() => {
    // async => request to server, wait for it, do something with the info
    
    const getCountriesData = async () => {
      await fetch("https://api.caw.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then(data => {
        const countries = data.map(country => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }
        ));
        
        const sortedData = sortData(data);
        setMapCountries(data);
        setTableData(sortedData);
        setCountries(countries);
      })
    }
    getCountriesData();
  }, []);

  
  useEffect(() => {
    // The code here runs only once i.e when the component loads and not again
    fetch("https://api.caw.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })    
  }, [] )
  

  const onCountryChange = async (e) => {
      const countryCode = e.target.value;
      // console.log(countryCode);

      
      
      const url = 
      countryCode === "worldwide" 
      ? "https://api.caw.sh/v3/covid-19/all" 
      : `https://api.caw.sh/v3/covid-19/countries/${countryCode}`
      
      await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        console.log(data);       

        if(countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(3);        
        }else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }

      })

  }

  return (
    <div className="app">
      <div className="app__left">

        {/* HEADER */}
        <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app__dropdown">
              <Select variant="outlined" onChange={onCountryChange} value={country}>

                {/* Loop through all the countries and show the dropdown list of the options */}
                <MenuItem value="worldwide">Worldwide</MenuItem>
                { countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                  ) ) }

              </Select>
            </FormControl>
        </div>

        {/* INFOBOX */}
        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recoveries" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        
        {/* MAP */}
        <Map 
        countries = {mapCountries}
        center={mapCenter}
        zoom={mapZoom} />

      </div>

      <Card className="app__rigth">
        <CardContent>
          {/* TABLE */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />

          {/* GRAPH */}
          <h3>Worldwide new cases</h3>
          <LineGraph casesType={"cases"} />

        </CardContent>
      </Card>

    
    </div>
  );
}

export default App;
