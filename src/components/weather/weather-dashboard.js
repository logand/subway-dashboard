import React, { Component } from "react";
import PropTypes from "prop-types";
import weatherData from "../../data/weather.json";
import forecastData from "../../data/forecast.json";
import { CurrentWeather, ForecastedWeather } from "./weather-display";

export default class WeatherDashboard extends Component {
  static propTypes = {
    useLocalData: PropTypes.bool,
    locationEnabled: PropTypes.bool.isRequired,
    hasLocation: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    })
  };

  state = {
    weatherData: null,
    forecastData: null
  };

  componentWillMount() {
    if (this.props.useLocalData) {
      this.setState({
        weatherData: weatherData,
        forecastData: forecastData
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.useLocalData) {
      const oldLatitude = this.props.latitude;
      const oldLongitude = this.props.longitude;
      const {
        hasLocation,
        locationEnabled,
        location: { latitude, longitude }
      } = nextProps;
      if (
        locationEnabled &&
        hasLocation &&
        (oldLatitude !== latitude || oldLongitude !== longitude)
      ) {
        this.updateWeather(latitude, longitude);
      }
    }
  }

  updateWeather(latitude, longitude) {
    this.fetchLocalWeather(latitude, longitude).then(weatherData => {
      this.setState({
        weatherData: weatherData
      });
    });
    this.fetchLocalForecast(latitude, longitude).then(forecastData => {
      this.setState({
        forecastData: forecastData
      });
    });
  }

  fetchLocalForecast = (latitude, longitude) => {
    const url =
      "http://api.openweathermap.org/data/2.5/forecast?APPID=a3a04842c291ac34b5e04a9b9d12ab8d&";
    const byLocation = `lat=${latitude}&lon=${longitude}`;

    const forecast = fetch(url + byLocation)
      .then(res => res.json())
      .then(json => {
        return json;
      });
    return forecast;
  };

  fetchLocalWeather = (latitude, longitude) => {
    const url =
      "http://api.openweathermap.org/data/2.5/weather?APPID=a3a04842c291ac34b5e04a9b9d12ab8d&";
    const byLocation = `lat=${latitude}&lon=${longitude}`;

    const weather = fetch(url + byLocation)
      .then(res => res.json())
      .then(json => {
        return json;
      });
    return weather;
  };

  render() {
    const { hasLocation } = this.props;
    const { weatherData, forecastData } = this.state;
    if ((!this.props.useLocalData && !hasLocation) || weatherData === null) {
      return null;
    }
    return (
      <div className="weatherDashboard">
        <CurrentWeather {...weatherData} />
        <ForecastedWeather {...forecastData} />
      </div>
    );
  }
}
