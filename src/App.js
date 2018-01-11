import React, { Component } from "react";
import logo from "./logo.svg";
import Header from "./components/header.js";
import SubwayDashboard from "./components/subway-dashboard.js";
import { Switch, Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router";

const App = props => (
  <div>
    <Header {...props} />
    <Main />
  </div>
);

const SubwayView = props => {
  return <SubwayDashboard {...props} />;
};

const Main = () => (
  <main>
    <Switch>
      <Route path="/" component={SubwayView} />
    </Switch>
  </main>
);

export default withRouter(App);
