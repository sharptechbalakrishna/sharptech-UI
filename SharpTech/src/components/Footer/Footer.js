import React from 'react'
import './Footer.css'
import { FaLinkedin, FaInstagram, FaEnvelope,  } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md'; // Importing MdEmail icon
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import Certification from '../../assets/Certification.png';





const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-text'>
      <p>© 2024 Sharp Tech Systems Pvt Ltd. All rights reserved.</p>
      <p className="iso-text">
          <img src={Certification} alt="Certification" /> ISO 27001 : 2022
        </p>
      </div>
      <ul>
        <li><a className="linkedin" href="https://www.linkedin.com/company/sharp-tech-systems/?viewAsMember=true"><FaLinkedin /></a></li>
        
        <li><a className="facebook" href="https://www.facebook.com/sharptechsystems/"><FaFacebook /></a></li> 
        <li><a className="email" href="mailto:your@email.com"><MdEmail /></a></li> {/* Using MdEmail icon */}
        <li><a className="instagram" href="sharptech"> <FaInstagram /></a></li>
        <li><a href="http://sharptechsystems.in/" target='_blank'>Terms of Services</a></li>
        <li><a href="http://sharptechsystems.in/" target='_blank'>Privacy Policy</a></li>


        {/* <li> <a className="email" href="mailto:your@email.com"><FaEnvelope /> </a></li> */}
          {/*<li><a className="email" href="mailto:your@email.com"><MdOutlineMarkEmailUnread /></a></li>  Using MdEmail icon */}
      </ul>
    </div>
  )
}

export default Footer
