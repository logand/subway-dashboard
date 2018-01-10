import React from "react";
import PropTypes from "prop-types";
import ToggleSwitch from "@trendmicro/react-toggle-switch";

const ToggleSwitchWithLabel = ({
  prelabel = "",
  postlabel = "",
  ...passThroughProps
}) => {
  return (
    <span className="toggleSwitchWithLabel">
      <span className="toggleSwitchWithLabel-prelabel">{prelabel}</span>
      <ToggleSwitch {...passThroughProps} />
      <span className="toggleSwitchWithLabel-postlabel">{postlabel}</span>
    </span>
  );
};

export default ToggleSwitchWithLabel;
