import React, { Component } from "react";
import PropTypes from "prop-types";

const CurrentWeather = ({ name, weather, main }) => {
  const todaysWeather = weather[0];
  const dayTime = "night";
  return (
    <div className="currentWeather">
      <div className="card">
        <div className="card-header h3 text-center">
          Current Weather in <small className="text-muted"> {name}</small>
        </div>
        <WeatherBox
          temp={main.temp}
          description={todaysWeather.main}
          isDay={true}
          weatherId={todaysWeather.id}
        />
      </div>
    </div>
  );
};

const ForecastedWeather = ({ list }) => {
  if (typeof list === "undefined" || list.length < 1) return null;
  const forecastItems = list.splice(0, 4);
  const generateForecast = items => {
    let forecastData = {
      rain: {
        willRain: false,
        amount: 0
      },
      snow: {
        willSnow: false,
        amount: 0
      },
      highWind: false,
      wind: {
        speed: 0,
        direction: 0
      },
      minTemp: null,
      maxTemp: null
    };

    items.forEach(forecastBlock => {
      if (forecastBlock.hasOwnProperty("rain")) {
        forecastData.rain.willRain = true;
        forecastData.rain.amount += forecastBlock.rain["3h"];
      }
      if (forecastBlock.hasOwnProperty("snow")) {
        forecastData.snow.willSnow = true;
        forecastData.snow.amount += forecastBlock.snow["3h"];
      }
      if (
        forecastBlock.hasOwnProperty("wind") &&
        (forecastBlock.wind.speed > 16 &&
          forecastBlock.wind.speed > forecastData.wind.speed)
      ) {
        forecastData.highWind = true;
        forecastData.wind = {
          speed: forecastBlock.wind.speed,
          direction: forecastBlock.wind.deg
        };
      }
      if (
        forecastData.minTemp === null ||
        forecastBlock.main.temp_min < forecastData.minTemp
      ) {
        forecastData.minTemp = forecastBlock.main.temp_min;
      }
      if (
        forecastData.maxTemp === null ||
        forecastBlock.main.temp_max > forecastData.maxTemp
      ) {
        forecastData.maxTemp = forecastBlock.main.temp_max;
      }
    });

    return forecastData;
  };

  const {
    rain,
    snow,
    highWind,
    wind: { speed, direction },
    minTemp,
    maxTemp
  } = generateForecast(forecastItems);

  return (
    <div className="forecastedWeather">
      <div className="card">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <h3>Temperature</h3>
            <TempDisplay temp={minTemp} label="Min" />
            <TempDisplay temp={maxTemp} label="Max" />
          </li>
          <PrecipitationWarning rain={rain} snow={snow} />
        </ul>
      </div>
    </div>
  );
};

const PrecipitationWarning = ({
  rain,
  snow,
  rain: { willRain },
  snow: { willSnow }
}) => {
  if (!willRain && !willSnow) {
    return null;
  } else {
    const title = `Prepare for ${willRain ? "Rain" : ""}${willRain && willSnow
      ? " and "
      : ""}${willSnow ? "Snow" : ""}`;
    return (
      <li className="list-group-item">
        <div className="precipitationDisplay list-group-item d-flex align-items-center flex-column text-center">
          <h4>Prepare for Precipitation!</h4>
          <i class="wi wi-umbrella" />
        </div>
      </li>
    );
  }
};

const TempDisplay = ({ temp, isFahrenheit = true, label = "" }) => {
  const iconClass = `wi wi-${isFahrenheit ? "fahrenheit" : "celsius"}`;
  const displayLabel =
    label !== "" ? <small className="text-muted">{label}</small> : null;
  return (
    <span className="temperatureDisplay">
      <h3 className="">
        {displayLabel} {temp}
      </h3>
      <i class={iconClass} />
    </span>
  );
};

const WeatherBox = ({ isDay, weatherId, temp, description }) => {
  const dayTime = isDay ? "day" : "night";
  return (
    <div className={`weatherIcon weatherIcon-${dayTime}`}>
      <i class={`wi wi-owm-${dayTime}-${weatherId}`} />
      <div className="weatherInfo">
        <h3 class="weatherTitle">{description}</h3>
        <TempDisplay temp={temp} />
      </div>
    </div>
  );
};

export { CurrentWeather, ForecastedWeather };
