import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  getWindDirectionDisplay,
  isDayCurrentlyTime,
  getTemperatureScaleStyle,
  getHoursForForecast,
  getDateTime,
  tempForDisplay
} from "../../utils.js";

const CurrentWeather = ({
  currently: { icon, summary, temperature, apparentTemperature },
  daily
}) => {
  const today = daily.data[0];
  const isDayTime = isDayCurrentlyTime(
    today.sunriseTime,
    today.sunsetTime,
    new Date()
  );
  return (
    <div className="currentWeather">
      <div className="card">
        <div className="card-header h3 text-center">Current Weather</div>
        <WeatherBox
          temp={temperature}
          apparentTemperature={apparentTemperature}
          description={summary}
          isDay={isDayTime}
          icon={icon}
        />
      </div>
    </div>
  );
};

class ForecastedWeather extends Component {
  static propTypes = {
    currently: PropTypes.object,
    hourly: PropTypes.object,
    daily: PropTypes.object
  };

  processHourlyData(hours, daily) {
    const today = daily[0];
    const hoursForForecast = getHoursForForecast(hours);
    let forecastInfo = {
      precipitation: {
        precipLikely: false,
        amount: null,
        maxTime: null,
        type: ""
      },
      wind: { speed: 0, direction: null, gust: 0, startAt: null },
      temps: {
        minTemp: 200,
        maxTemp: -100,
        apparentMin: null,
        apparentMax: null
      },
      summary: "",
      icon: ""
    };

    const afterSevenPM = new Date().getHours() > 19;
    forecastInfo.wind = {
      speed: today.windSpeed,
      gust: today.windGust,
      direction: today.windBearing,
      maxAt: today.windGustTime
    };

    forecastInfo.summary = today.summary;
    forecastInfo.icon = today.icon;

    // 
    if (today.hasOwnProperty("precipType")) {
      forecastInfo.precipitation = {
        amount: today.precipAccumulation,
        maxTime: today.precipIntensityMaxTime,
        type: today.precipType,
        probability: today.precipProbability
      };
      if (today.precipProbability > 0.25) {
        forecastInfo.precipitation.precipLikely = true;
      }
    }
    if (!afterSevenPM) {
      for (let hour of hoursForForecast) {
        if (
          forecastInfo.precipitation.startAt !== null &&
          hour.hasOwnProperty("precipType")
        ) {
          forecastInfo.precipitation.startAt = hour.time;
        }
      }
      forecastInfo.temps.minTemp = today.temperatureMin;
      forecastInfo.temps.apparentMin = today.apparentTemperatureMin;
      forecastInfo.temps.maxTemp = today.temperatureMax;
      forecastInfo.temps.apparentMax = today.apparentTemperatureMax;
    }
    if (afterSevenPM) {
      for (let hour of hoursForForecast) {
        // wind
        if (forecastInfo.wind.windGust < hour.windGust) {
          forecastInfo.wind = {
            speed: hour.windSpeed,
            gust: hour.windGust,
            direction: hour.windBearing,
            maxTime: hour.time
          };
        }

        // precipitation
        if (hour.hasOwnProperty("precipType")) {
          if (forecastInfo.precipitation.startAt !== null) {
            forecastInfo.precipitation.startAt = hour.time;
            forecastInfo.precipitation.type = hour.precipType;
          }
          forecastInfo.precipitation.amount += hour.precipAccumulation;
          if (hour.precipProbability > 0.25) {
            forecastInfo.precipitation.precipLikely = true;
          }
        }
      }
    }
    return forecastInfo;
  }

  render() {
    const { daily, hourly } = this.props;
    if (daily === null) {
      return null;
    }
    const dailyForecast = daily.data[0];
    const hourlyData = this.processHourlyData(
      hourly.data,
      daily.data.slice(0, 2)
    );
    return (
      <div className="forecastedWeather">
        <div className="card">
          <ul className="list-group list-group-flush">
            <div className="card-header h3 text-center">
              Forecast <small className="text-muted">- 12 Hours</small>
            </div>
            <FutureWeatherBox {...hourlyData} />
            <PrecipitationWarning {...hourlyData.precipitation} />
            <WindWarning {...hourlyData.wind} />
          </ul>
        </div>
      </div>
    );
  }
}

const Alerts = ({ alerts }) => {
  if (typeof alerts !== "undefined") {
    const alertList = alerts.map(alert => (
      <WeatherAlert {...alert} key={alert.title} />
    ));
    return (
      <div className="weatherAlert">
        <div className="card">
          <div className="card-header h3 text-center">Severe Weather Alert</div>
          <div className="list-group list-group-flush">{alertList}</div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const WeatherAlert = ({ description, expires, title, severity }) => {
  if (typeof description === "undefined") {
    return null;
  }
  const expiresTime = getDateTime(expires).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return (
    <li className="list-group-item">
      <h5 className="card-title">{title}</h5>
      <h5 className="card-text">Expires at {expiresTime}</h5>
    </li>
  );
};

const PrecipitationWarning = (
  { precipLikely, amount, maxTime, startAt, type },
  context
) => {
  if (!precipLikely) {
    return null;
  } else {
    const title = `Prepare for ${type}`;
    let displayAmount = null;
    if (typeof amount !== "undefined") {
      if (context.useMetric) {
        displayAmount = `${(amount * 2.54).toFixed(2)} cm`;
      } else {
        displayAmount = `${amount.toFixed(2)}"`;
      }
    }
    let timeDisplay = null;
    if (startAt !== null)
      timeDisplay = getDateTime(startAt).toLocaleTimeString("en-US", {
        hour12: true,
        hour: "numeric"
      });

    const iconClass = type === "rain" ? "umbrella" : "snow";
    return (
      <li className="precipitationDisplay list-group-item">
        <div className="precipitationDisplay-container list-group-item">
          <h4 className="precipitationDisplay-title">{title}</h4>
          <i className={`wi pb-2 wi-${iconClass}`} />
          <h5>
            {displayAmount} starting @ {timeDisplay}
          </h5>
        </div>
      </li>
    );
  }
};

PrecipitationWarning.contextTypes = {
  useMetric: PropTypes.bool
};

const WindWarning = ({ speed, direction, gust, maxAt }, context) => {
  if (gust < 15) {
    return null;
  } else {
    const windDescription =
      Math.abs(gust - speed) > 8 ? "Heavy Wind Gusts" : "High Winds!";
    const windDirection = Math.floor(direction);
    const windDisplay = getWindDirectionDisplay(direction);
    const getWindSpeed = (useMetric, windSpeed) => {
      if (useMetric) {
        return `${(windSpeed * 0.447).toFixed(1)} m/s`;
      } else {
        return `${windSpeed.toFixed(1)} mph`;
      }
    };
    const timeDisplay = getDateTime(maxAt).toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric"
    });
    return (
      <li className="windDisplay list-group-item">
        <h4>{windDescription}</h4>
        <span className="windDisplay-indicators text-center">
          <div className="windIndicator windIndicator-speed">
            <i className="wi wi-strong-wind" />
            <h5>Avg {getWindSpeed(context.useMetric, speed)}</h5>
            <h5>
              Gusts to {getWindSpeed(context.useMetric, gust)} @ {timeDisplay}
            </h5>
          </div>
          <div className="windIndicator windIndicator-direction">
            <div className="windIndicator-spinner">
              <i className={`wi wi-wind from-${windDirection}-deg`} />
            </div>
            <p className="lead">
              <small>From</small> {windDisplay}
            </p>
          </div>
        </span>
      </li>
    );
  }
};

WindWarning.contextTypes = {
  useMetric: PropTypes.bool
};

const TempDisplay = ({ temp, label = "", alt = null }, context) => {
  const { useMetric } = context;
  const iconClass = `wi wi-${useMetric ? "celsius" : "fahrenheit"}`;
  const displayLabel = label !== "" ? <small>{label}</small> : null;
  return (
    <span className="temperatureDisplay">
      <h3 className="temperatureDisplay-temp">
        {displayLabel} {tempForDisplay(temp, useMetric)}
      </h3>
      <i className={iconClass} />
      {alt === null ? null : (
        <small className="temperatureDisplay-apparentTemp ml-2">
          ({tempForDisplay(alt, useMetric)}
          <i className={iconClass} />)
        </small>
      )}
    </span>
  );
};

TempDisplay.contextTypes = {
  useMetric: PropTypes.bool
};

const WeatherBox = ({
  isDay,
  icon,
  temp,
  description,
  apparentTemperature
}) => {
  const dayTime = isDay ? "day" : "night";
  return (
    <div className={`weatherIcon weatherIcon-${dayTime}`}>
      <h3 className="weatherTitle">{description}</h3>
      <i className={`wi wi-forecast-io-${icon}`} />
      <div className="weatherInfo">
        <TempDisplay temp={temp} />
        {apparentTemperature ? (
          <TempDisplay temp={apparentTemperature} label="Feels Like" />
        ) : null}
      </div>
    </div>
  );
};

const FutureWeatherBox = ({
  precipitation,
  wind,
  temps: { minTemp, maxTemp, apparentMin, apparentMax },
  summary,
  icon
}) => {
  const tempStyle = getTemperatureScaleStyle(apparentMin, apparentMax);
  return (
    <div style={tempStyle} className={`weatherIcon weatherIcon-future`}>
      <h3 className="weatherTitle">{summary}</h3>
      <i className={`wi wi-forecast-io-${icon}`} />
      <div className="weatherInfo">
        <i className="wi wi-thermometer" />
        <div className="temperaturesDisplay-temps">
          <TempDisplay temp={maxTemp} label="Max" alt={apparentMax} />
          <TempDisplay temp={minTemp} label="Min" alt={apparentMin} />
        </div>
      </div>
    </div>
  );
};

export { CurrentWeather, ForecastedWeather, Alerts };
