import React from "react";
import LandingDisplay from "./landing-display";
import Login from "../login/login";
import ForgotPassword from "../login/forgotpassword";
import ResetPassword from "../login/resetPassword";
import AdminListing from "../admin/admin-listing";
import AdminView from "../admin/admin-view";
import AddUser from "../admin/addUser";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";

function Landing() {
    return (
      <Router>
        <Routes>
          <Route path="/" exact element={<LandingDisplay />} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="forgotpassword" exact element={<ForgotPassword/>} />
          <Route path="/resetPassword" exact element={<ResetPassword/>} />
          <Route path="/admin-listing" exact element={<AdminListing/>} />
          <Route path="/admin-view/:userId" exact element={<AdminView/>} />
          <Route path="/addUser" exact element={<AddUser/>} />
        </Routes>
      </Router>
    );
  }
  

export default Landing;