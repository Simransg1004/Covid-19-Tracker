import React from "react";
import { Circle, Popup } from "react-leaflet";

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));

  return sortedData;
};

const casesTypeColor = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.lat]}
      fillOpacity={0.4}
      color={casesTypeColor[casesType].hex}
      fillColor={casesTypeColor[casesType].hex}
      radius={Math.sqrt(
        country[casesType] * casesTypeColor[casesType].multiplier
      )}
    ></Circle>
  ));
