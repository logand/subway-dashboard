import React from "react";
import PropTypes from "prop-types";

const StationDisplay = ({ stations }) => {
  const stationsDisplay = stations.map(station => {
    return <Station stationData={station} key={station.id} />;
  });
  return stationsDisplay;
};

const Station = ({ stationData }) => {
  return <ValidStation stationData={stationData} />;
};

const ValidStation = ({ stationData }) => {
  const { name, N, S, routes } = stationData;
  let body = null;
  const routesDisplay = (
    <span className="stationRoutes">
      {routes.map(route => <TrainSymbol route={route} key={route} />)}
    </span>
  );
  if (stationData["last_update"] === null) {
    body = <div className="text-center h3">No Data Available</div>;
  } else {
    const northBound = <RouteList name="Uptown" trains={N} />;
    const southBound = <RouteList name="Downtown" trains={S} />;
    body = (
      <div className="card-group">
        {northBound}
        {southBound}
      </div>
    );
  }
  return (
    <div className="card station">
      <div className="card-header text-center h3">
        {name} {routesDisplay}
      </div>
      <div className="card-body">{body}</div>
    </div>
  );
};

const RouteList = ({ name, trains }) => {
  const currentTime = Date.now();
  const trainDisplay = trains.map(train => {
    return <Train {...train} key={`${train.route}${train.time}`} />;
  });
  return (
    <div className="card routeList">
      <div className="card-header lead">{name}</div>
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
    if (minutesDiff < 1) {
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
