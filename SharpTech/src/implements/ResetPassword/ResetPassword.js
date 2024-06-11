import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {


  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Using useNavigate hook


  const location = useLocation();
  const { email } = location.state || {};  // Get the email from state

  if (!email) {
    return <p>No email provided. Please go back and enter your email again.</p>;
  }




  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/reset-password', {
        email,
        otp,
        newPassword
      });
    //   console.log(response);
      setMessage(response);
      setError('');
      window.alert(response.data);
      // Redirect to login page after successful password reset
      navigate('/login');
    } catch (err) {
      setMessage('');
      setError(err.response.data || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="reset-password-input-group">
            <label>OTP:</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
            />
          </div>
          <div className="reset-password-input-group">
            <label>New Password:</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
        {message && <p className="reset-password-success-message">{message}</p>}
        {error && <p className="reset-password-error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
