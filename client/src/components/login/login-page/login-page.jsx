import React, { useState } from "react";
import {ClipLoader} from 'react-spinners';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";
import PopupMessage from "../../popupMessage/popupMessage";
import './login-page.css';





export default function LoginPage() {

    const Navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    let [color, setColor] = useState("#ffffff");
    const [loginResponse, setLoginResponse] = useState(null);

    const override = {
      display: "block",
      margin: "0 auto",
      borderColor: "red",
    };

    const handleEmailChange = (e) => {
      setEmail(e.target.value);
      validateEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    }

    const handleLogin = async (e) => {

      e.preventDefault();
      const HOSTED_SERVER_URL = 'http://localhost:2005';

      setIsLoading(true);

      try {
        const response = await axios.post(`${HOSTED_SERVER_URL}/login`, {
          email,
          password
        });

        setLoginResponse(response);

        if (response.data.statusCode === 200) {
          console.log('Login Successful');
          // setShowPopup('true');
          setPopupType('success');
          setPopupMessage('Login Successful');
        } else {
          // setShowPopup('true');
          setPopupType('error');
          setPopupMessage('Login Failed');
          console.error('Login Failed:', response.data.message);
        }
      }catch (error) {
        // setShowPopup('true');
        setPopupType('error');
        setPopupMessage('Something went wrong');
        console.error('Error during login:', error);
      } finally {
        setIsLoading(false);
        
          setShowPopup(true);
       
  }
      }

    

    function validateEmail() {
      let email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      let isEmailValid = email_regex.test(email);
      
      if (!isEmailValid) {
          setEmailError("Invalid Email");
      } else {
          setEmailError("");
      }
  }

  const handlePopupOK = () => {
    setShowPopup(false);
    if (popupType === 'success' && loginResponse) {
      localStorage.setItem('token',loginResponse.data.data);
      setTimeout(() => {
        Navigate('/admin-listing');
      }, 600);
      // Navigate('/admin-listing');
    }
};

const handlePopupTryAgain = () => {
    setShowPopup(false);
};

    return(

        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login Page</title>
  <link rel="stylesheet" href="admin-login.css" />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
  />
  <div className="admin-login-container">
    <h2 id="admin-login-h2">Login</h2>
    <form onSubmit={handleLogin}>
      <div className="admin-login-form-group">
        <label className="admin-login-label" htmlFor="email">
          Email:
        </label>
        <div className="input-wrapper">
          <i className="fas fa-envelope" />
          <input
            className="admin-login-input"
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleEmailChange}
            required=""
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>
      </div>
      <div className="admin-login-form-group">
        <label className="admin-login-label" htmlFor="password">
          Password:
        </label>
        <div className="input-wrapper">
          <i className="fas fa-lock" />
          <input
            className="admin-login-input"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={handlePasswordChange}
            required=""
          />
        </div>
      </div>
      <div className="forgot-password">
        <Link to={'/forgotPassword'}>Forgot password?</Link>
      </div>
      <button id="admin-login-button" type="submit" onClick={() => setIsLoading(!isLoading)}>
        Login
      </button>
      {isLoading && (
            <div className="spinner-container">
              <div className="spinner-overlay">
                <div className="spinner">
                <ClipLoader
                  color={color}
                  loading={isLoading}
                  size={50}
                />
                </div>
              </div>
            </div>
          )}
      {error && <p>{error}</p>}
    </form>
  </div> 
  {showPopup && <PopupMessage type={popupType} message={popupMessage} onOK={handlePopupOK} onTryAgain={handlePopupTryAgain} />}
</>


    );
    }

    