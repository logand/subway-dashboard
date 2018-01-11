import React from "react";
import PropTypes from "prop-types";
import SubwayControls from "./subway/subway-controls";
import StationDisplay from "./subway/station-display";
import subwayData from "../data/location-example.json";
import { geolocated, geoPropTypes } from "react-geolocated";

class SubwayDashboard extends React.Component {
  static propTypes = {
    useLocalData: PropTypes.bool,
    ...geoPropTypes
  };

  state = {
    stations: [],
    lastUpdated: null,
    isDark: false,
    location: {
      hasLocation: false,
      latitude: null,
      longitude: null
    }
  };

  static childContextTypes = {
    comparisonTime: PropTypes.number
  };

  getChildContext() {
    return {
      comparisonTime: Date.now()
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.state.location.hasLocation === false &&
      nextProps.coords !== null
    ) {
      const { coords: { latitude, longitude } } = nextProps;
      this.updateLocation(true, latitude, longitude);
    }
  }

  updateLocation(hasLocation, latitude, longitude) {
    if (hasLocation) {
      this.updateStations(latitude, longitude);
    }
  }

  updateStations(latitude, longitude) {
    this.fetchLocalStations(latitude, longitude).then(stations => {
      this.setState({
        stations: stations.data,
        location: {
          hasLocation: true,
          latitude: latitude,
          longitude: longitude
        }
      });
    });
  }

  fetchLocalStations = (latitude, longitude) => {
    const url = "https://mighty-wildwood-28716.herokuapp.com/";
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const byLocation = `by-location?lat=${latitude}&lon=${longitude}`;

    const trains = fetch(proxyUrl + url + byLocation)
      .then(res => res.json())
      .then(json => {
        return json;
      });
    return trains;
  };

  setCurrentLocation = (latitude, longitude) => {};

  componentDidMount() {
    if (this.props.useLocalData) {
      this.setState({
        trains: subwayData.data,
        lastUpdated: subwayData.updated
      });
    }
  }

  toggleStyle = () => {
    this.setState({ darkStyle: !this.state.darkStyle });
  };

  render() {
    const { stations, darkStyle, location: { hasLocation } } = this.state;
    const styleClass = darkStyle
      ? "subwayContainer--light"
      : "subwayContainer--dark";
    return (
      <div className={`subwayContainer ${styleClass}`}>
        <SubwayControls
          toggleStyle={this.toggleStyle}
          activeStyle={!this.state.darkStyle}
          hasLocation={hasLocation}
        />
        <StationDisplay stations={stations} />
      </div>
    );
  }
}

export default geolocated()(SubwayDashboard);
