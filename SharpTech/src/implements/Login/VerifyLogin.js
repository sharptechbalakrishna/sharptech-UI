import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner'; // Importing ProgressSpinner
import UserService from '../UserService/UserService';
import AuthContext from '../AuthContext/AuthContext';
import './VerifyLogin.css';

const VerifyLogin = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Using useNavigate hook

  const { verifylogin } = useContext(AuthContext);
  const location = useLocation();
  const { email } = location.state || {}; // Get the email from state

  if (!email) {
    return <p>No email provided. Please go back and enter your email again.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when verification process starts

    try {
      const userData = await UserService.verifylogin(email, otp);
      console.log(userData);
      if (userData.token) {
        verifylogin(userData.token, userData.role, userData.transactionId);
        localStorage.setItem('email', email); // Store email in localStorage
        navigate('/DisplayLogin');
      } else {
        setError(userData.message);
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false); // Set loading to false when verification process completes
    }
  };

  return (
    <div className="verify-login-container">
      <div className="verify-login-box">
        <h1>Enter OTP</h1>
        <form onSubmit={handleSubmit}>
          <div className="verify-login-input-group">
            <label>OTP:</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <ProgressSpinner style={{ width: '24px', height: '18px', marginRight: '8px' }} strokeWidth="4" />
                Verifying...
              </>
            ) : (
              'Verify Login'
            )}
          </button>
        </form>
        {message && <p className="verify-login-success-message">{message}</p>}
        {error && <p className="verify-login-error-message">{error}</p>}
      </div>
    </div>
  );
};

export default VerifyLogin;
