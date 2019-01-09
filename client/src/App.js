import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Mobile from "./components/Mobile";
import Desktop from "./components/Desktop/Desktop";
import "./App.css";

export const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Mobile} />
      <Route exact path="/desktop" component={Desktop} />
    </Switch>
  </BrowserRouter>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router />
      </div>
    );
  }
}

export default App;
