import React from 'react';
import { Link } from "react-router-dom";
import { ReactSession }  from 'react-client-session';

import './app.scss';

function App() {
  return (
      <div className="home">
        <div className="wrapper">
          <h1>Start Food <br/> Inventory!</h1>
          <div className={"loggedout " + (!ReactSession.get("loggedIn") && "active")}>
            <Link to="/login">
              <h3>Login</h3>
            </Link>
            <span></span>
            <Link to="/register">
              <h3>Register</h3>
            </Link>
          </div>
          <div className={"loggedin " + (ReactSession.get("loggedIn") && "active")}>
            <Link to="/items">
              <h3>View Items</h3>
            </Link>
          </div>
        </div>
      </div>
  );
}

export default App;
