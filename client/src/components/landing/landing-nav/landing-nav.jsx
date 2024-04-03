import React from "react";
import './landing-nav.css';
import { Link } from "react-router-dom";

function LandingNav({displayData}) {

  return(

    <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="homenav.css" />
  <header>
    <nav className="navbar">
      <div className="navbar-container container">
        <input type="checkbox" name="" id="" />
        <div className="hamburger-lines">
          <span className="line line1" />
          <span className="line line2" />
          <span className="line line3" />
        </div>
        <ul className="menu-items">
          <li>
            <Link to={'/'}>Home</Link>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Category</a>
          </li>
          <li>
            <a href="#">Menu</a>
          </li>
          <li>
            <a href="#">Testimonial</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <h1 className="logo">USER MANAGEMENT</h1>
      </div>
    </nav>
  </header>
</>


  )

}

export default LandingNav;