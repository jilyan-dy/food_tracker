import React from 'react';
import './app.scss';
import { Link } from "react-router-dom";

function App() {
  return (
      <div className="home">
        <div className="wrapper">
          <h1>Welcome ShiDa Fam!</h1>
          <div className="actions">
            <Link to="/login">
              <h3>Login</h3>
            </Link>
            <span></span>
            <Link to="/register">
              <h3>Register</h3>
            </Link>
          </div>
        </div>
      </div>
  );
}

export default App;
