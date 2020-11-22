import { FormControl, MenuItem, Select } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([
    "India", "USA", "FRANCE","China"
  ]);

  return (
    <div className="app">
      <div className="app__header">
        <h1>Covid-19 tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value="abc">
            {
              countries.map(country =>(
              <MenuItem value={country}>{country}</MenuItem>
              ))
            }

            {/* <MenuItem vlaue="Worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">option2</MenuItem>
            <MenuItem value="worldwide">option3</MenuItem>
            <MenuItem value="worldwide">option4</MenuItem> */}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default App;
