import React from "react";
import './landing-page.css';
import { Link } from "react-router-dom";

function LandingPage() {

    return(

        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="homebody.css" />
  <main>
    <section className="login-section">
      <div className="container">
        <h2>LOGIN HERE</h2>
        <Link to={'/login'}><button id="admin-login-btn">LOGIN</button></Link>
      </div>
    </section>
    <section className="features-section">
      <div className="container">
        <h2>Features</h2>
        <p>Explore the powerful features of our user management system:</p>
        <ul>
          <li>User Authentication</li>
          <li>Role-Based Access Control</li>
          <li>User Profile Management</li>
          <li>Activity Logs</li>
        </ul>
      </div>
    </section>
  </main>
</>

    )

}

export default LandingPage;