import React from "react";
import PropTypes from "prop-types";
import SubwayControls from "./subway-controls";
import StationDisplay from "./station-display";
import subwayData from "../../data/location-example.json";

class SubwayDashboard extends React.Component {
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

  componentDidMount() {
    if (this.props.useLocalData) {
      this.setState({
        stations: subwayData.data,
        lastUpdated: subwayData.updated
      });
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

  toggleStyle = () => {
    this.setState({ darkStyle: !this.state.darkStyle });
  };

  render() {
    const { stations, darkStyle } = this.state;
    const { locationEnabled, hasLocation, location } = this.props;
    const styleClass = darkStyle
      ? "subwayContainer--light"
      : "subwayContainer--dark";
    return (
      <div className={`subwayContainer ${styleClass}`}>
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

export default SubwayDashboard;
