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
    useMetric: false,
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

  static childContextTypes = {
    useMetric: PropTypes.bool,
    toggleMetric: PropTypes.func
  };

  getChildContext() {
    return {
      toggleMetric: this.toggleMetric,
      useMetric: this.state.useMetric
    };
  }

  componentWillMount() {
    if (!this.props.useLocalData && this.props.isGeolocationEnabled) {
      this.setState({ locationEnabled: true });
    }
  }

  toggleMetric = () => {
    this.setState({ useMetric: !this.state.useMetric });
  };

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
    const { location, hasLocation, locationEnabled, useMetric } = this.state;
    const { useLocalData } = this.props;
    const locationProps = {
      location: location,
      locationEnabled: locationEnabled,
      hasLocation: hasLocation
    };
    return (
      <div className="dashboard">
        <SubwayDashboard
          useLocalData={useLocalData}
          {...locationProps}
          toggleMetric={this.toggleMetric}
          useMetric={useMetric}
        />
        <WeatherDashboard
          useLocalData={useLocalData}
          {...locationProps}
          useMetric={useMetric}
        />
      </div>
    );
  }
}

export default geolocated()(Dashboard);
