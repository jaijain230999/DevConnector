import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Alert from './components/layout/Alert'

import Register from './components/auth/Register'
import Login from './components/auth/Login'

import { Provider } from 'react-redux'
import store from './store'

import './App.scss';

const App = () => (
  <Provider store={store}>
    <Router>
      <Navbar />
      <Route exact path="/" component={ Landing } />
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/login" component={ Login } />
          <Route exact path="/register" component={ Register } />
        </Switch>
      </section>
    </Router>
  </Provider>
);

export default App;
