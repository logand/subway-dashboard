import React, { Component } from "react";
import PropTypes from "prop-types";
import SubwayDashboard from "./subway/subway-dashboard";
import WeatherDashboard from "./weather/weather-dashboard";
import { geolocated, geoPropTypes } from "react-geolocated";

class Dashboard extends Component {
  static propTypes = {
    useLocalData: PropTypes.bool,
    ...geoPropTypes
  };

  state = {
    locationEnabled: false,
    hasLocation: false,
    location: {
      latitude: null,
      longitude: null
    }
  };

  static defaultProps = {
    useLocalData: false
  };

  componentWillMount() {
    if (!this.props.useLocalData && this.props.isGeolocationEnabled) {
      this.setState({ locationEnabled: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.useLocalData &&
      this.state.hasLocation === false &&
      nextProps.coords !== null &&
      this.props.isGeolocationEnabled
    ) {
      const { coords: { latitude, longitude } } = nextProps;
      this.setState({
        hasLocation: true,
        location: {
          latitude: latitude,
          longitude: longitude
        }
      });
    }
  }

  render() {
    const { location, hasLocation, locationEnabled } = this.state;
    const { useLocalData } = this.props;
    const locationProps = {
      location: location,
      locationEnabled: locationEnabled,
      hasLocation: hasLocation
    };
    return (
      <div className="dashboard">
        <SubwayDashboard useLocalData={useLocalData} {...locationProps} />
        <WeatherDashboard useLocalData={useLocalData} {...locationProps} />
      </div>
    );
  }
}

export default geolocated()(Dashboard);
