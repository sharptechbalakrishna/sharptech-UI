import React, { useEffect, useState, useContext, useRef } from 'react';
import './Navbar.css';
import logo from '../../assets/SharpTechLogo.png';
import menu_icon from '../../assets/menu-icon.png';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import AuthContext from '../../implements/AuthContext/AuthContext';
import Dropdown from "../../implements/Dropdown/Dropdown";
import { useNavigate } from 'react-router-dom';
import UserService from '../../implements/UserService/UserService';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const hasLoggedOutRef = useRef(false); // New ref to track logout status

  const handleLogout = async (confirm = true) => {
    if (isLoggingOut || hasLoggedOutRef.current) return;

    if (!confirm || window.confirm('Are you sure you want to logout this user?')) {
      setIsLoggingOut(true);
      hasLoggedOutRef.current = true; // Set ref to true to prevent further logouts

      try {
        logout();
        const email = localStorage.getItem('email');
        const transactionId = localStorage.getItem('transactionId');
        if (!email) {
          console.error('Email not found in localStorage');
          return;
        }
        const response = await UserService.logout(email, transactionId);
        if (response.statusCode === 200) {
          logout();
          navigate('/');
        } else {
          console.error('Logout failed:', response.message);
          hasLoggedOutRef.current = false; // Allow another attempt if failed
          logout();
        }
      } catch (error) {
        console.error('Logout error:', error);
        hasLoggedOutRef.current = false; // Allow another attempt if error occurs
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    const logoutAfterInterval = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const elapsedTime = Date.now() - parseInt(loginTime, 10);
        const logoutTime = 82800000; // 23hrs 
        if (elapsedTime >= logoutTime && !hasLoggedOutRef.current) {
          localStorage.removeItem('loginTime');
          handleLogout(false);
        } else {
          const timeout = setTimeout(() => {
            if (!hasLoggedOutRef.current) {
              handleLogout(false);
            }
          }, logoutTime - elapsedTime);

          return () => clearTimeout(timeout);
        }
      }
    };

    logoutAfterInterval();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenu(prevState => !prevState);
  };

  return (
    <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
      <Link to='Navbar'>
        <img src={logo} alt="" className={`logo ${sticky ? 'sticky-logo' : ''}`} />
      </Link>
      <ul className={mobileMenu ? '' : 'hide-mobile-menu'}>
        {!isAuthenticated && <li><Link to='carousel' smooth={true} offset={-250} duration={500}>Home</Link></li>}
        {!isAuthenticated && <li><Link to='about' smooth={true} offset={-150} duration={500}>About</Link></li>}
        {!isAuthenticated && <li><Link to='program' smooth={true} offset={-440} duration={500}>Services</Link></li>}
        {!isAuthenticated && <li><Link to='testimonials' smooth={true} offset={-320} duration={500}>Reports</Link></li>}
        {!isAuthenticated && <li><Link to='contact' smooth={true} offset={-250} duration={500}>Contact</Link></li>}
        {isAdmin && <li><RouterLink to='/Register'>Register</RouterLink></li>}
        {isAdmin && <li><RouterLink to='/Pagination'>Employees List</RouterLink></li>}
        {isAuthenticated && <li><Dropdown /></li>}
        {isAuthenticated ? (
          <li className='btn'><RouterLink to="/" onClick={() => handleLogout(true)}>Logout</RouterLink></li>
        ) : (
          <li className='btn'><RouterLink to="/Login">Login</RouterLink></li>
        )}
      </ul>
      <img src={menu_icon} alt="" className='menu-icon' onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;
