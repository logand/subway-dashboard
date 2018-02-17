import React from "react";
import PropTypes from "prop-types";
import ToggleSwitch from "@trendmicro/react-toggle-switch";

const ToggleSwitchWithLabel = ({
  prelabel = "",
  postlabel = "",
  label = "",
  ...passThroughProps
}) => {
  return (
    <span className="toggleSwitchWithLabel">
      <span className="toggleSwitchWithLabel-label">{label}</span>
      <span className="toggleSwitchWithLabel-switch">
        <span className="toggleSwitchWithLabel-prelabel">{prelabel}</span>
        <ToggleSwitch {...passThroughProps} />
        <span className="toggleSwitchWithLabel-postlabel">{postlabel}</span>
      </span>
    </span>
  );
};

export default ToggleSwitchWithLabel;
