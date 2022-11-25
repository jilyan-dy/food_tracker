import React from 'react';
import './app.scss';

import Layout from "../components/Layout"

function App() {
  return (
    <Layout>
      <div className="home">
        <div className="wrapper">
          <h1>Welcome ShiDa Fam!</h1>
          <div className="actions">
            <a href="/login">
              <h3>Login</h3>
            </a>
            <span></span>
            <a href="/register">
              <h3>Register</h3>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
