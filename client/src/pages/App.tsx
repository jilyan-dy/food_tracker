import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from "react-client-session";

import { REACT_SESSION } from "../constants";
import Login from "../components/Login";
import Register from "../components/Register";
import "./app.scss";

function App() {
  const [login, setLogin] = useState(true);

  return (
    <div className="home">
      <div className="wrapper">
        <div className="left">
          <h1>Food Tracker</h1>
          <h2>Start tracking your inventory!</h2>
        </div>
        <div className="right">
          <div
            className={
              "loggedout " +
              (!ReactSession.get(REACT_SESSION.loggedIn) && "active")
            }
          >
            <div className="login-actions">
              <Link onClick={() => setLogin(true)} to="">
                <span className={"action " + (login && "active")}>Login</span>
              </Link>
              <Link onClick={() => setLogin(false)} to="">
                <span className={"action " + (!login && "active")}>
                  Sign Up
                </span>
              </Link>
            </div>
            <div className="forms">
              {login && <Login></Login>}
              {!login && <Register></Register>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
