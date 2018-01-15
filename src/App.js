import React from "react";
import Header from "./components/header.js";
import Dashboard from "./components/dashboard.js";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";

const App = props => (
  <div>
    <Header {...props} />
    <Main />
  </div>
);

const View = props => {
  return <Dashboard {...props} useLocalData={false} />;
};

const Main = () => (
  <main>
    <Switch>
      <Route path="/" component={View} />
    </Switch>
  </main>
);

export default withRouter(App);
