import React from "react";
import PropTypes from "prop-types";
import ToggleSwitchWithLabel from "../shared/label-toggle-switch";

const SubwayControls = ({ toggleStyle, activeStyle, getCurrentLocation }) => {
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
      </div>
    </nav>
  );
};

export default SubwayControls;
