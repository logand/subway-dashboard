import React from "react";
import PropTypes from "prop-types";
import ToggleSwitchWithLabel from "../shared/label-toggle-switch";
import { IconPlayArrow } from "../shared/icons";

const StationDisplay = ({ stations }) => {
  const stationsDisplay = stations.map(station => {
    return <Station stationData={station} key={station.id} />;
  });
  return <div className="stationsContainer">{stationsDisplay}</div>;
};

const Station = ({ stationData }) => {
  return <ValidStation stationData={stationData} />;
};

class ValidStation extends React.Component {
  state = {
    isUptown: true,
    halfStation: false
  };

  static contextTypes = {
    limitTrains: PropTypes.bool
  };

  toggleHalfStation = () => {
    this.setState({ halfStation: !this.state.halfStation });
  };

  toggleUptown = () => {
    this.setState({ isUptown: !this.state.isUptown });
  };

  getTrains(limitTrains, trainList, routes) {
    let trains = null;
    if (!limitTrains) {
      trains = trainList;
    } else {
      let trainCount = [];
      for (let route of routes) {
        trainCount[route] = 0;
      }

      trains = [];
      for (let train of trainList) {
        if (trainCount[train.route] < 2) {
          trains.push(train);
          trainCount[train.route] += 1;
        }
      }
    }
    return trains;
  }

  render() {
    const { stationData: { name, N, S, routes, id, last_update } } = this.props;
    let body = null;
    if (last_update === null) {
      body = <div className="text-center h3">No Data Available</div>;
    }
    const routesDisplay = (
      <span className="stationRoutes">
        {routes.map(route => <TrainSymbol route={route} key={route} />)}
      </span>
    );
    const { allTrains, isUptown, halfStation } = this.state;
    const { limitTrains } = this.context;
    const northBoundTrains = this.getTrains(limitTrains, N, routes);
    const southBoundTrains = this.getTrains(limitTrains, S, routes);
    const northBound =
      halfStation && !isUptown ? null : (
        <RouteList name="Uptown" trains={northBoundTrains} uptown={true} />
      );
    const southBound =
      halfStation && isUptown ? null : (
        <RouteList name="Downtown" trains={southBoundTrains} uptown={false} />
      );
    const contolProps = {
      isUptown: isUptown,
      halfStation: halfStation,
      toggleUptown: this.toggleUptown,
      toggleHalfStation: this.toggleHalfStation
    };
    body = (
      <div className="card-group">
        {northBound}
        {southBound}
      </div>
    );
    const stationClass = `card station ${halfStation
      ? "station--half"
      : "station--full"}`;
    return (
      <div className={stationClass}>
        <div className="card-header text-center h3">
          {name} {routesDisplay} <StationControls {...contolProps} />
        </div>
        <div className="card-body">{body}</div>
      </div>
    );
  }
}

const StationControls = ({
  isUptown,
  toggleUptown,
  halfStation,
  toggleHalfStation
}) => {
  return (
    <div className="stationControls mt-2">
      <ToggleSwitchWithLabel
        checked={halfStation}
        onChange={event => {
          toggleHalfStation();
        }}
        prelabel="Full Station"
        postlabel="Half"
      />
      {halfStation ? (
        <ToggleSwitchWithLabel
          checked={!isUptown}
          onChange={event => {
            toggleUptown();
          }}
          prelabel="Uptown"
          postlabel="Downtown"
        />
      ) : null}
    </div>
  );
};

StationControls.propTypes = {
  isUptown: PropTypes.bool.isRequired,
  halfStation: PropTypes.bool.isRequired,
  toggleUptown: PropTypes.func.isRequired,
  toggleHalfStation: PropTypes.func.isRequired
};

const RouteList = ({ name, trains, uptown }) => {
  const trainDisplay = trains.map(train => {
    return <Train {...train} key={`${train.route}${train.time}`} />;
  });
  return (
    <div className="card routeList">
      <div className="card-header lead">
        {name}
        <IconPlayArrow className={uptown ? "north" : "south"} />
      </div>
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
    let text = "";
    const trainTime = new Date(time);
    const minutesDiff = Math.ceil(
      (trainTime.getTime() - comparisonTime) / 60000
    );
    let displayTime = Math.abs(minutesDiff);
    if (minutesDiff <= 1 && minutesDiff > -1) {
      text = "Now";
      displayTime = null;
    } else if (minutesDiff < 0) {
      text = " Min Ago";
    } else {
      text = " Min";
    }
    return { displayTime: displayTime, text: text };
  };
  const { displayTime, text } = getTrainStatus();
  return (
    <span className="trainStatus">
      {displayTime !== null ? (
        <span className="trainStatus-time">{displayTime}</span>
      ) : null}

      <span className="trainStatus-text">{text}</span>
    </span>
  );
};

TrainTime.contextTypes = {
  comparisonTime: PropTypes.number
};

export default StationDisplay;
