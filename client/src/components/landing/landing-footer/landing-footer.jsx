import React from "react";
import './landing-footer.css';

export default function LandingFooter() {

    return(

        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="homefooter.css" />
  <footer>
    <div className="container">
      <div className="footer-content">
        <div className="footer-info">
          <h3>Contact Us</h3>
          <p>Email: info@example.com</p>
          <p>Phone: +1234567890</p>
        </div>
        <div className="footer-nav">
          <ul>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="copyright">
        © 2024 User Management System. All rights reserved.
      </p>
    </div>
  </footer>
</>


    )

}

