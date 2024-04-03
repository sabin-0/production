import React, {useState} from "react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:2005/forgot-password', {
        email: email
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

    return(

        <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Forgot Password</title>
  <div className="container">
    <form className="forgot-password-form" onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <div className="form-group">
        <label htmlFor="email">Type email linked to your profile</label>
        <input
          type="email"
          id="emailf"
          name="emailf"
          required=""
          onChange={handleEmailChange}
        />
      </div>
      <button type="submit">Send Email</button>
      {message && <p>{message}</p>}
    </form>
  </div>
</>


    )

}