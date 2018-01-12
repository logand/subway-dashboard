import React, { Component } from "react";
import PropTypes from "prop-types";
import { getWindDirectionDisplay } from "../../utils.js";

const CurrentWeather = ({ name, weather, main }) => {
  const todaysWeather = weather[0];
  const now = new Date();
  const hour = now.getHours();
  const dayTime = hour > 4 && hour < 18 ? "day" : "night";
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

class ForecastedWeather extends Component {
  state = {
    rain: {
      willRain: false,
      amount: 0
    },
    snow: {
      willSnow: false,
      amount: 0
    },
    wind: {
      highWind: true,
      speed: 0,
      direction: null
    },
    minTemp: null,
    maxTemp: null
  };

  componentWillReceiveProps(nextProps) {
    this.processProps(nextProps.list);
  }

  processProps(list) {
    let forecastData = {
      rain: {
        willRain: false,
        amount: 0
      },
      snow: {
        willSnow: false,
        amount: 0
      },
      wind: {
        speed: 0,
        direction: 0
      },
      minTemp: null,
      maxTemp: null
    };

    const forecastItems = list.splice(0, 4);

    forecastItems.forEach(forecastBlock => {
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
        forecastBlock.wind.speed > forecastData.wind.speed
      ) {
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

    this.setState({
      ...forecastData
    });
  }

  render() {
    const { rain, snow, wind, minTemp, maxTemp } = this.state;
    return minTemp === null ? null : (
      <div className="forecastedWeather">
        <div className="card">
          <ul className="list-group list-group-flush">
            <div className="card-header h3 text-center">
              Forecast <small className="text-muted">- 12 Hours</small>
            </div>
            <MinMaxTempDisplay minTemp={minTemp} maxTemp={maxTemp} />
            <PrecipitationWarning rain={rain} snow={snow} />
            <WindWarning {...wind} />
          </ul>
        </div>
      </div>
    );
  }
}

const MinMaxTempDisplay = ({ minTemp, maxTemp }) => {
  return (
    <li className="list-group-item temperaturesDisplay">
      <i className="wi wi-thermometer" />
      <div className="temperaturesDisplay-temps">
        <TempDisplay temp={minTemp} label="Min" />
        <TempDisplay temp={maxTemp} label="Max" />
      </div>
    </li>
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
    const amount = ((rain.amount + snow.amount) * 0.0393701).toFixed(2);
    return (
      <li className="precipitationDisplay list-group-item">
        <div className="precipitationDisplay-container list-group-item">
          <h4>Prepare for Precipitation!</h4>
          <i className="wi wi-umbrella" />
          <h5>{amount} inches</h5>
        </div>
      </li>
    );
  }
};

const WindWarning = ({ speed, direction }) => {
  if (direction === null || speed < 6) {
    return null;
  } else {
    const windDescription = speed > 16 ? "Howling Winds!" : "Light Winds Ahead";
    const windDirection = Math.floor(direction);
    const windDisplay = getWindDirectionDisplay(direction);
    return (
      <li className="windDisplay list-group-item">
        <h4>{windDescription}</h4>
        <span className="windDisplay-indicators">
          <div className="windIndicator windIndicator-speed">
            <i className="wi wi-strong-wind" />
            <h5>{Math.round(speed)} mph</h5>
          </div>
          <div className="windIndicator windIndicator-direction">
            <div className="windIndicator-spinner">
              <i className={`wi wi-wind towards-${windDirection}-deg`} />
            </div>
            <p className="lead">{windDisplay}</p>
          </div>
        </span>
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
        {displayLabel} {Math.round(temp)}
      </h3>
      <i className={iconClass} />
    </span>
  );
};

const WeatherBox = ({ isDay, weatherId, temp, description }) => {
  const dayTime = isDay ? "day" : "night";
  return (
    <div className={`weatherIcon weatherIcon-${dayTime}`}>
      <i className={`wi wi-owm-${dayTime}-${weatherId}`} />
      <div className="weatherInfo">
        <h3 className="weatherTitle">{description}</h3>
        <TempDisplay temp={temp} />
      </div>
    </div>
  );
};

export { CurrentWeather, ForecastedWeather };
