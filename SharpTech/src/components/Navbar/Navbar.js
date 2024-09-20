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
import Modal from '../Modal/Modal';
import login_icon from '../../assets/Login_Icon.png'
import Modula from '../Modula/Modula';
// import UpdatesImage from '../../assets/Updates.png';

import axios from 'axios';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const hasLoggedOutRef = useRef(false); // New ref to track logout status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [UpdateData, setUpdateData] = useState();
  const [visible, setVisible] = useState(() => {
    const savedVisible = sessionStorage.getItem('visible');
    return savedVisible ? JSON.parse(savedVisible) : false;
  });
  // const [latestdate, setLatestDate] = useState(false);
  // const currentDate = new Date().toISOString().split('T')[0];
  // const showUpdateImage = latestdate && latestdate >= currentDate;




  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Update sessionStorage whenever 'visible' changes
  useEffect(() => {
    sessionStorage.setItem('visible', JSON.stringify(visible));
  }, [visible]);

  // Function to update the visible state
  const toggleVisible = () => {
    setVisible(prevVisible => !prevVisible);
  };


  useEffect(() => {
    console.log(visible);
    featureUpdate();
    console.log(visible);
  }, []);



  const featureUpdate = async () => {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/future/updates`);
      setVisible(response.data.updatesList[response.data.updatesList.length - 1].visible);
      setUpdateData(response.data); // Remove quotes to store actual data

      // Dont remove the below code it should be use in future

      // console.log("Visible",response.data.updatesList[response.data.updatesList.length-1]);
      // const ld = response.data.updatesList[response.data.updatesList.length - 1].releaseDate;
      // console.log("Latest Date", ld);
      // setLatestDate(response.data.updatesList[response.data.updatesList.length - 1].releaseDate) // Taking the first latest date of the entry
    } catch (error) {
      console.log(error);
    }
  };

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


  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Add an event listener to detect clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false); // Hide the dropdown if clicked outside
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <nav className={`container ${sticky ? 'dark-nav' : ''}`}>
        <Link to='Navbar'>
          <img src={logo} alt="" className={`logo ${sticky ? 'sticky-logo' : ''}`} />
        </Link>
        <ul className={mobileMenu ? '' : 'hide-mobile-menu'}>


          {!isAuthenticated && <li className="events-text"><Link to='carousel' smooth={true} offset={-250} duration={500}>Home</Link></li>}

          {!isAuthenticated && <li className="events-text"><Link to='about' smooth={true} offset={-150} duration={500}>About</Link></li>}
          {!isAuthenticated && <li className="events-text"><Link to='program' smooth={true} offset={-440} duration={500}>Services</Link></li>}

          {/* {!isAuthenticated && (
            <li className="home-link">
              <span className="events-text" onClick={openModal}>
                Updates
                {visible && (
                  <img
                    src={UpdatesImage}
                    alt="Updates"
                    className="updates-badge"
                    onClick={openModal}
                  />
                )}
              </span>
            </li>
          )} */}

          {!isAuthenticated && <li className="events-text"><Link to='testimonials' smooth={true} offset={-320} duration={500}>Reports</Link></li>}
          {!isAuthenticated && <li className="events-text"><Link to='contact' smooth={true} offset={-250} duration={500}>Contact</Link></li>}
          {isAdmin && <li><RouterLink to='/Register'>Register</RouterLink></li>}
          {isAdmin && <li><RouterLink to='/Pagination'>Employees List</RouterLink></li>}
          {isAuthenticated && <li><Dropdown /></li>}

          {!mobileMenu ?

            <li className="events-text">
              <div className="login_icon-container" onClick={toggleDropdown}>
                <img src={login_icon} alt="Login Icon" className="login_icon" />
                {/* Conditionally render the NEW label based on the visible state */}
                {visible && (
                  <span className="new-label">NEW</span>
                )}
              </div>
              {/* Conditionally render the dropdown */}
              <div ref={dropdownRef} className={`dropdown-box ${isDropdownVisible ? 'show' : ''}`}>
                <ul>

                  {visible && (
                    <>
                      <li onClick={openModal}>What's New</li>
                      <span className="new-label_Updates">NEW</span>
                    </>
                  )}
                  {isAuthenticated ? (
                    <li><RouterLink to="/" onClick={() => handleLogout(true)}>Logout</RouterLink></li>
                  ) : (
                    <li><RouterLink to="/Login">Login</RouterLink></li>
                  )}
                </ul>
              </div>
            </li>

            : isAuthenticated ? (
              <li className='btn'><RouterLink to="/" onClick={() => handleLogout(true)}>Logout</RouterLink></li>
            ) : (
              <li className='btn'><RouterLink to="/Login">Login</RouterLink></li>
            )}






          {/* {isAuthenticated ? (
            <li className='btn'><RouterLink to="/" onClick={() => handleLogout(true)}>Logout</RouterLink></li>
          ) : (
            <li className='btn'><RouterLink to="/Login">Login</RouterLink></li>
          )} */}



        </ul>
        <img src={menu_icon} alt="" className='menu-icon' onClick={toggleMenu} />


      </nav>
      {/* {isModalOpen &&
        <Modal
          onClose={closeModal}
          UpdateData={UpdateData}
        />} */}

      {isModalOpen &&
        <Modula
          onClose={closeModal}
          UpdateData={UpdateData}
        />}




    </>
  );
};

export default Navbar;
