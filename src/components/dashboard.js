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
    useMetic: false,
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
    useMetic: PropTypes.bool,
    toggleMetric: PropTypes.func
  };

  getChildContext() {
    return {
      toggleMetric: this.toggleMetric,
      useMetic: this.state.useMetic
    };
  }

  componentWillMount() {
    if (!this.props.useLocalData && this.props.isGeolocationEnabled) {
      this.setState({ locationEnabled: true });
    }
  }

  toggleMetric = () => {
    this.setState({ useMetic: !this.state.useMetic });
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
    const { location, hasLocation, locationEnabled, useMetic } = this.state;
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
          useMetic={useMetic}
        />
        <WeatherDashboard
          useLocalData={useLocalData}
          {...locationProps}
          useMetic={useMetic}
        />
      </div>
    );
  }
}

export default geolocated()(Dashboard);
