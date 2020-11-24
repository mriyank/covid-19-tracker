import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import "./App.css";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  // const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // full country name
            value: country.countryInfo.iso2, //2letter country name
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldWide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  // const onCountryChange = async (e) => {
  //   const countryCode = e.target.value;

  //   const url =
  //     countryCode === "worldwide"
  //       ? "https://disease.sh/v3/covid-19/all"
  //       : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  //   await fetch(url)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCountry(countryCode);
  //       setCountryInfo(data);
  //       setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
  //       setMapZoom(4);
  //     });
  // };

  // console.log("Countryinfo>>>", countryInfo);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map center={mapCenter} zoom={mapZoom}></Map>
      </div>

      <div>
        <Card className="app__right">
          <CardContent>
            <h3>Live cases by Country</h3>
            <Table countries={tableData}></Table>
            <h3>Worldwide new Cases</h3>
            <LineGraph />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
