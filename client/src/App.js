import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Mobile from './components/Mobile/Mobile';
import Desktop from './components/Desktop/Desktop';
import './App.css';

export const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Mobile} />
      <Route exact path="/desktop" component={Desktop} />
    </Switch>
  </BrowserRouter>
);

function App() {
  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
