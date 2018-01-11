import React, { Component } from "react";
import logo from "./logo.svg";
import Header from "./components/header.js";
import Dashboard from "./components/dashboard.js";
import { Switch, Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router";

const App = props => (
  <div>
    <Header {...props} />
    <Main />
  </div>
);

const View = props => {
  return <Dashboard {...props} useLocalData={true} />;
};

const Main = () => (
  <main>
    <Switch>
      <Route path="/" component={View} />
    </Switch>
  </main>
);

export default withRouter(App);
