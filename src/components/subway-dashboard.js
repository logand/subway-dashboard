import React from "react";
import PropTypes from "prop-types";
import ToggleSwitchWithLabel from "./shared/label-toggle-switch";

export default class SubwayDashboard extends React.Component {
  static propTypes = {
    subwayData: PropTypes.shape({}).isRequired
  };

  state = {
    stations: this.props.subwayData.data,
    lastUpdated: this.props.subwayData.updated,
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

  toggleStyle = () => {
    this.setState({ darkStyle: !this.state.darkStyle });
  };

  render() {
    const { darkStyle } = this.state;
    const styleClass = darkStyle
      ? "subwayContainer--light"
      : "subwayContainer--dark";
    const stationsDisplay = this.state.stations.map(station => {
      return <Station stationData={station} key={station.id} />;
    });
    return (
      <div className={`subwayContainer ${styleClass}`}>
        <SubwayControls
          toggleStyle={this.toggleStyle}
          activeStyle={!this.state.darkStyle}
        />
        {stationsDisplay}
      </div>
    );
  }
}

const Station = ({ stationData }) => {
  const { name, N, S, routes } = stationData;
  const northBound = <RouteList name="Uptown" trains={N} />;
  const southBound = <RouteList name="Downtown" trains={S} />;
  const routesDisplay = (
    <span className="stationRoutes">
      {routes.map(route => <TrainSymbol route={route} key={route} />)}
    </span>
  );
  return (
    <div className="card">
      <div className="card-header text-center h3">
        {name} {routesDisplay}
      </div>
      <div className="card-body">
        <div class="card-group">
          {northBound}
          {southBound}
        </div>
      </div>
    </div>
  );
};

const RouteList = ({ name, trains }) => {
  const currentTime = Date.now();
  const trainDisplay = trains.map(train => {
    return <Train {...train} />;
  });
  return (
    <div className="card routeList">
      <div class="card-header lead">{name}</div>
      <div className="card-body">{trainDisplay}</div>
    </div>
  );
};

const Train = ({ route, time }) => {
  return (
    <div className="train">
      <TrainSymbol route={route} />
      <TrainTime time={time} />
    </div>
  );
};

const TrainSymbol = ({ route }) => {
  const classes = `mta-bullet line-${route}`;
  return <span className={classes}>{route}</span>;
};

const TrainTime = ({ time }, context) => {
  const { comparisonTime } = context;
  const getTrainStatus = () => {
    let text = "Now";
    const trainTime = new Date(time);
    const minutesDiff = Math.ceil(
      (trainTime.getTime() - comparisonTime) / 60000
    );
    if (minutesDiff < 0) {
      text = " Min Ago";
    } else {
      text = " Min";
    }
    return { displayTime: Math.abs(minutesDiff), text: text };
  };
  const { displayTime, text } = getTrainStatus();
  return (
    <span className="trainStatus">
      <span className="trainStatus-time">{displayTime}</span>
      <span className="trainStatus-text">{text}</span>
    </span>
  );
};

TrainTime.contextTypes = {
  comparisonTime: PropTypes.number
};

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
