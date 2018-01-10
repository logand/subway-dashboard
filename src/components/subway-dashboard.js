import React from "react";
import PropTypes from "prop-types";

export default class SubwayDashboard extends React.Component {
  static propTypes = {
    subwayData: PropTypes.shape({}).isRequired
  };

  state = {
    stations: this.props.subwayData.data,
    lastUpdated: this.props.subwayData.updated
  };

  static childContextTypes = {
    comparisonTime: PropTypes.number
  };

  getChildContext() {
    return {
      comparisonTime: Date.now()
    };
  }

  render() {
    const stationsDisplay = this.state.stations.map(station => {
      return <Station stationData={station} key={station.id} />;
    });
    return <div className="subway-container">{stationsDisplay}</div>;
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
      <div className="card-header text-center">
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
      <div class="card-header bg-transparent">{name}</div>
      <div className="card-body">
        <h5 className="card-title" />
        {trainDisplay}
      </div>
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
