import React from "react";
import PropTypes from "prop-types";
import ToggleSwitchWithLabel from "../shared/label-toggle-switch";
import {
  NoLocationIcon,
  HasLocationIcon,
  FindingLocationIcon
} from "../shared/icons";

class SubwayControls extends React.Component {
  static propTypes = {
    toggleStyle: PropTypes.func.isRequired,
    activeStyle: PropTypes.bool.isRequired,
    hasLocation: PropTypes.bool,
    toggleMetric: PropTypes.func.isRequired,
    useMetic: PropTypes.bool.isRequired
  };

  static contextTypes = {
    toggleMetric: PropTypes.func,
    useMetic: PropTypes.bool
  };

  render() {
    const {
      toggleStyle,
      activeStyle,
      hasLocation,
      locationEnabled,
      location: { latitude, longitude }
    } = this.props;
    const { useMetic, toggleMetric } = this.context;
    let locationDisplay = null;

    if (!locationEnabled) {
      locationDisplay = (
        <span className="locationDisplay">
          <NoLocationIcon />
          <p className="locationDisplay-text text-muted">
            Location Services Unavailable
          </p>
        </span>
      );
    } else if (hasLocation) {
      const location = ` (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
      locationDisplay = (
        <span className="locationDisplay locationDisplay--enabled">
          <HasLocationIcon />
          <p className="locationDisplay-text">
            Using Current Location @ {location}
          </p>
        </span>
      );
    } else {
      locationDisplay = (
        <span className="locationDisplay">
          <FindingLocationIcon />
          <p className="locationDisplay-text">Finding Current Location...</p>
        </span>
      );
    }
    return (
      <nav className="navbar navbar-expand-sm">
        <a className="navbar-brand">Style:</a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <ToggleSwitchWithLabel
              checked={activeStyle}
              onChange={event => {
                toggleStyle();
              }}
              prelabel="Light"
              postlabel="Dark"
            />
          </ul>
          <ul className="navbar-nav">
            <ToggleSwitchWithLabel
              checked={useMetic}
              onChange={event => {
                toggleMetric();
              }}
              prelabel="°F"
              postlabel="°C"
            />
          </ul>
          <ul className="navbar-nav">{locationDisplay}</ul>
        </div>
      </nav>
    );
  }
}

export default SubwayControls;
