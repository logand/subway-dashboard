import React from "react";
import PropTypes from "prop-types";
import SubwayControls from "./subway-controls";
import StationDisplay from "./station-display";
import subwayData from "../../data/location-example.json";
import ReactInterval from "react-interval";

export default class SubwayDashboard extends React.Component {
  static propTypes = {
    useLocalData: PropTypes.bool,
    locationEnabled: PropTypes.bool.isRequired,
    hasLocation: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    toggleMetric: PropTypes.func.isRequired,
    useMetric: PropTypes.bool.isRequired
  };

  state = {
    stations: [],
    lastUpdated: null,
    isDark: false,
    timeout: 30000,
    enabled: true,
    comparisonTime: Date.now(),
    limitTrains: false
  };

  static childContextTypes = {
    comparisonTime: PropTypes.number,
    limitTrains: PropTypes.bool
  };

  getChildContext() {
    return {
      comparisonTime: this.state.comparisonTime,
      limitTrains: this.state.limitTrains
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

  toggleTrainLimit = () => {
    this.setState({ limitTrains: !this.state.limitTrains });
  };

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
    const { stations, darkStyle, timeout, enabled, limitTrains } = this.state;
    const {
      locationEnabled,
      hasLocation,
      location,
      useMetric,
      toggleMetric
    } = this.props;
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
          toggleTrainLimit={this.toggleTrainLimit}
        />
        <StationDisplay stations={stations} />
        <ReactInterval
          {...{ timeout, enabled }}
          callback={() => this.setState({ comparisonTime: Date.now() })}
        />;
      </div>
    );
  }
}
