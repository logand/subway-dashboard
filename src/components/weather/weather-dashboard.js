import React, { Component } from "react";
import PropTypes from "prop-types";
import weatherData from "../../data/weather.json";
import { CurrentWeather, ForecastedWeather, Alerts } from "./weather-display";

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
    weatherTimerId: null,
    newestFetchId: 0
  };

  static contextTypes = {
    toggleMetric: PropTypes.func,
    useMetric: PropTypes.bool
  };

  componentWillMount() {
    if (this.props.useLocalData) {
      this.setState({
        weatherData: weatherData
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

  componentWillUnmount() {
    this.clearWeatherTimer();
  }

  updateWeather(latitude, longitude) {
    this.clearWeatherTimer();
    const fetchId = this.state.newestFetchId + 1;
    this.setState({newestFetchId: fetchId});
    this.fetchWeather(latitude, longitude).then(weatherData => {
      if (fetchId === this.state.newestFetchId) {
        const weatherTimerId = setTimeout(this.updateWeather.bind(this), 600000, latitude, longitude);
        this.setState({
          weatherData: weatherData,
          weatherTimerId: weatherTimerId
        });
      };
    });
  }
  
  clearWeatherTimer() {
    if (this.state.weatherTimerId) {
      clearTimeout(this.state.weatherTimerId);
      this.setState({weatherTimerId: null});
    }
  }

  fetchWeather = (latitude, longitude) => {
    const proxyUrl = "https://peaceful-badlands-31479.herokuapp.com/";
    const url =
      "https://api.darksky.net/forecast/360b0fe1e0cddfeab4aad4ca09528007/";
    const byLocation = `${latitude},${longitude}`;
    const options = `?exclude=[minutely,flags]&units=us`;
    // const options = `?exclude=[minutely,flags]&units=${this.context.useMetric ? "si" : "us"}`;

    const weather = fetch(proxyUrl + url + byLocation + options)
      .then(res => res.json())
      .then(json => {
        return json;
      });
    return weather;
  };

  render() {
    const { hasLocation } = this.props;
    const { weatherData } = this.state;
    if ((!this.props.useLocalData && !hasLocation) || weatherData === null) {
      return null;
    }
    return (
      <div className="weatherDashboard">
        <Alerts alerts={weatherData.alerts} />
        <CurrentWeather {...weatherData} />
        <ForecastedWeather {...weatherData} />
      </div>
    );
  }
}
