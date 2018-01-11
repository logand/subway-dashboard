import React from "react";
import PropTypes from "prop-types";
import ToggleSwitchWithLabel from "../shared/label-toggle-switch";
import { NoLocationArrow, HasLocationArrow } from "../shared/icons";

class SubwayControls extends React.Component {
  static propTypes = {
    toggleStyle: PropTypes.func.isRequired,
    activeStyle: PropTypes.bool.isRequired,
    hasLocation: PropTypes.bool
  };

  render() {
    const { toggleStyle, activeStyle, hasLocation } = this.props;
    const locationDisplay = hasLocation ? (
      <HasLocationArrow />
    ) : (
      <NoLocationArrow />
    );
    return (
      <nav className="navbar navbar-expand-sm">
        <a className="navbar-brand">Controls</a>
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
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Use My Location
          </button>
          {locationDisplay}
        </div>
      </nav>
    );
  }
}

export default SubwayControls;
