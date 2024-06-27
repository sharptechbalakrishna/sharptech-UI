import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LoginNavbar from '../LoginNavbar/LoginNavbar';
import Footer from '../../components/Footer/Footer';
import UserService from '../UserService/UserService';
import L_1 from '../../assets/login_image_6.jpg';
import { Link } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner'; // Importing ProgressSpinner
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login process starts

    try {
      const response = await UserService.login(email, password);
      console.log(response);
      if (response.statusCode === 200) {
        localStorage.setItem('email', email); // Store email in localStorage
        alert(response.message);
        navigate('/VerifyLogin', { state: { email } });  // Pass email in state
      } else {
        setError(response.message);
        setTimeout(() => {
          setError('');
        }, 3500);
      }
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false); // Set loading to false when login process completes
    }
  };

  return (
    <div>
      <LoginNavbar />
      <div className='login-page-container'>
        <div className='login-image'>
          <img src={L_1} alt="" />
        </div>
        <form className='login-form' onSubmit={handleSubmit}>
          <div className='login-heading-container'>
            <h1>Welcome to Sharp Tech Systems</h1> <br />
            <p>Please login with below details to access your account.</p>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className='input-group'>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className='input-group'>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className='login-button' type="submit" disabled={loading}>
            {loading ? (
              <>
                <ProgressSpinner style={{ width: '24px', height: '18px', marginRight: '8px' }} strokeWidth="4" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
          <br />
          <Link to="/ForgetPassword" className='forgot-password'>Forgot Password?</Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
