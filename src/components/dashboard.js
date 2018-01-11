import React, { Component } from "react";
import PropTypes from "prop-types";
import SubwayDashboard from "./subway/subway-dashboard";
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

  componentWillMount() {
    if (this.props.isGeolocationEnabled) {
      this.setState({ locationEnabled: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
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
    return (
      <div className="dashboard">
        <SubwayDashboard
          useLocalData={useLocalData}
          location={location}
          locationEnabled={locationEnabled}
          hasLocation={hasLocation}
        />
      </div>
    );
  }
}

export default geolocated()(Dashboard);
