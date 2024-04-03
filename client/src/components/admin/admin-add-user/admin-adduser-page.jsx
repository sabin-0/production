import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './User.css';

function AddUserPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false); 
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFirstnameChange = (e) => setFirstname(e.target.value);
  const handleLastnameChange = (e) => setLastname(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);

  const handleOutsideClick = (e) => {
    if (!e.target.closest('input')) {
      setErrors({});
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newErrors = {};

    if (!firstname) {
      newErrors.firstname = 'First name is required';
    }

    if (!lastname) {
      newErrors.lastname = 'Last name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!phone) {
      newErrors.phone = 'Password is required';
    } 

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const HOSTED_SERVER_URL = 'http://localhost:2005';

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${HOSTED_SERVER_URL}/users`, {
          firstname,
          lastname,
          email,
          phone,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response && response.data && response.data.statusCode) {
          alert('Form submitted successfully');
          console.log('Form submitted successfully');
          setFirstname('');
          setLastname('');
          setEmail('');
          setPhone('');
         
        } else {
          console.error('Form submission failed');
        }
      } catch (error) {
        console.error('Error during form Submission:', error.response ? error.response.data.message : error.message);
      }
    }

    setSubmitting(false);
  };

  return (
    <>
      <section className="container">
        <div className="login-container">
          <div className="form-container">
            <h1 className="opacity">ADD USER</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="First Name" value={firstname} onChange={handleFirstnameChange} />
              {errors.firstname && <p className='error-message'>{errors.firstname}</p>}
              <input type="text" placeholder="Last Name" value={lastname} onChange={handleLastnameChange} />
              {errors.lastname && <p className='error-message'>{errors.lastname}</p>}
              <input type="email" placeholder="EMAIL" value={email} onChange={handleEmailChange} />
              {errors.email && <p className='error-message'>{errors.email}</p>}
              <input type="number" placeholder="PHONE" value={phone} onChange={handlePhoneChange} />
              {errors.phone && <p className='error-message'>{errors.phone}</p>}
              <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'SUBMIT'}</button>
            </form>
          </div>
        </div>
        <div className="theme-btn-container"></div>
      </section>
    </>
  );
}

export default AddUserPage;