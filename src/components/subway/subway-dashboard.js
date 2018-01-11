import React from "react";
import PropTypes from "prop-types";
import SubwayControls from "./subway-controls";
import StationDisplay from "./station-display";
import subwayData from "../../data/location-example.json";
import { geolocated, geoPropTypes } from "react-geolocated";

export default class SubwayDashboard extends React.Component {
  static propTypes = {
    useLocalData: PropTypes.bool,
    locationEnabled: PropTypes.bool,
    hasLocation: PropTypes.bool,
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    })
  };

  state = {
    stations: [],
    lastUpdated: null,
    isDark: false
  };

  static childContextTypes = {
    comparisonTime: PropTypes.number
  };

  getChildContext() {
    return {
      comparisonTime: Date.now()
    };
  }

  componentWillMount() {
    if (this.props.isGeolocationEnabled) {
      this.setState({ locationEnabled: true });
    }
  }

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
      this.updateStations(latitude, longitude);
    }
  }

  updateStations(latitude, longitude) {
    this.fetchLocalStations(latitude, longitude).then(stations => {
      this.setState({
        stations: stations.data,
        lastUpdated: stations.updated
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

  componentDidMount() {
    if (this.props.useLocalData) {
      this.setState({
        stations: subwayData.data,
        lastUpdated: subwayData.updated
      });
    }
  }

  toggleStyle = () => {
    this.setState({ darkStyle: !this.state.darkStyle });
  };

  render() {
    const { hasLocation, locationEnabled, location } = this.props;
    const { stations, darkStyle } = this.state;
    const styleClass = darkStyle
      ? "subwayDashboard--light"
      : "subwayDashboard--dark";
    return (
      <div className={`subwayDashboard ${styleClass}`}>
        <SubwayControls
          toggleStyle={this.toggleStyle}
          activeStyle={!this.state.darkStyle}
          hasLocation={hasLocation}
          locationEnabled={locationEnabled}
          location={location}
        />
        <StationDisplay stations={stations} />
      </div>
    );
  }
}
