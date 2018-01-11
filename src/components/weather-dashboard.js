import React, { Component } from "react";
import PropTypes from "prop-types";
import { UmbrellaIcon } from "./shared/icons";

export default class WeatherDashboard extends Component {
  static propTypes = {
    location: PropTypes.object,
    current: PropTypes.object,
    forecast: PropTypes.object,
    locationEnabled: PropTypes.bool.isRequired,
    hasLocation: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    })
  };

  state = {
    location: null,
    current: null,
    forecast: null
  };

  componentWillReceiveProps(nextProps) {
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

  updateWeather(latitude, longitude) {
    this.fetchLocalWeather(latitude, longitude).then(weatherData => {
      this.setState({
        location: weatherData.location,
        current: weatherData.current,
        forecast: weatherData.forecast.forecastday[0]
      });
    });
  }

  fetchLocalWeather = (latitude, longitude) => {
    const url =
      "https://api.apixu.com/v1/forecast.json?key=c2149d1a9665489b892215126180601&days=1&q=";
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const byLocation = `${latitude},${longitude}`;

    const weather = fetch(proxyUrl + url + byLocation)
      .then(res => res.json())
      .then(json => {
        return json;
      });
    return weather;
  };

  willNeedUmbrella() {
    const { current: { precip_in }, forecast: { totalprecip_in } } = this.state;
    // const willRain = precip_in > 0 || totalprecip_in > 0;
    const willRain = true;
    if (willRain) {
      return (
        <li className="list-group-item d-flex align-items-center flex-column text-center">
          <h4>Prepare for Precipitation!</h4>
          <UmbrellaIcon />
        </li>
      );
    } else {
      return null;
    }
  }

  render() {
    const { hasLocation } = this.props;
    const { location, current, forecast } = this.state;
    if (!hasLocation || current === null) {
      return null;
    }
    const umbrella = this.willNeedUmbrella();
    return (
      <div className="weatherDashboard">
        <div className="card">
          <div class="card-header h3">
            Current Weather <small class="text-muted">in {location.name}</small>
          </div>
          <img
            className="card-img-top"
            src={current.condition.icon}
            alt="Card image cap"
          />
          <div className="card-body">
            <h5 className="card-title">{current.condition.text}</h5>
            <h6 className="card-subtitle mb-2 text-muted" />
            <p className="card-text">
              <h3>
                <small class="text-muted">Temp</small>
                {current.temp_f}
              </h3>
              <h4>
                <small class="text-muted">Feels Like</small>
                {current.feelslike_f}
              </h4>
            </p>
          </div>
          <div class="card-header h3">Forecast</div>
          <ul className="list-group list-group-flush">
            {umbrella}
            <li className="list-group-item">
              <h3>Temperature</h3>
              <h4>
                <small class="text-muted">Min</small>
                {forecast.day.mintemp_f}
              </h4>
              <h4>
                <small class="text-muted">Max</small>
                {forecast.day.maxtemp_f}
              </h4>
            </li>
            <li className="list-group-item">
              <h4>
                <small class="text-muted">Min</small>
                {forecast.day.mintemp_f}
              </h4>
              <h4>
                <small class="text-muted">Max</small>
                {forecast.day.maxtemp_f}
              </h4>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
