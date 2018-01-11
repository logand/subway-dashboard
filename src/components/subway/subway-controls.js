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
    hasLocation: PropTypes.bool
  };

  render() {
    const {
      toggleStyle,
      activeStyle,
      hasLocation,
      locationEnabled
    } = this.props;
    let locationIcon = null;
    let locationStatus = null;

    if (!locationEnabled) {
      locationStatus = (
        <button className="btn btn-link my-2 my-sm-0" type="submit">
          Location Services Unavailable
        </button>
      );
      locationIcon = <NoLocationIcon />;
    } else if (hasLocation) {
      locationStatus = (
        <button className="btn btn-link my-2 my-sm-0" type="submit">
          Using Current Location
        </button>
      );
      locationIcon = <HasLocationIcon />;
    } else {
      locationStatus = (
        <button className="btn btn-link my-2 my-sm-0" type="submit">
          Finding Current Location...
        </button>
      );
      locationIcon = <FindingLocationIcon />;
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
            {locationStatus}
            {locationIcon}
          </ul>
        </div>
      </nav>
    );
  }
}

export default SubwayControls;
