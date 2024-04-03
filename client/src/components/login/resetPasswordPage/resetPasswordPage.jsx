import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      const token = new URLSearchParams(window.location.search).get("token");
      
      const response = await axios.patch("http://localhost:2005/reset-password", {
        password: newPassword,
        confirmPassword: confirmPassword,
      },
      {
        "headers" : {
          "Authorization" : `Bearer ${token}` 
        },
      }
      );

     
      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setError(null);
        setNewPassword("");
        setConfirmPassword("");
        navigate("/login");
      }
    } catch (error) {
      // If an error occurs, display the error message
      setError(error.response.data.message);
      setSuccessMessage(null);
    }
  };

    return(

        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password</title>
  <link rel="stylesheet" href="styles.css" />
  <div className="container">
    <form className="reset-password-form" onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <div className="form-group">
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          name="new-password"
          required=""
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          required=""
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button type="submit">Reset Password</button>
    </form>
  </div>
</>


    )

}