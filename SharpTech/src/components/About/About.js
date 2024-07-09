import React from 'react'
import './About.css'
import about_img from '../../assets/about-7.jpg'
import play_icon from '../../assets/play-icon.png'
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';


const About = ({ setPlayState }) => {
  return (
    <div>
      <div className='about'>
        <Navbar />
        <div className="about-left">
          <img src={about_img} alt="" className='about-img' />
          <img src={play_icon} alt="" className='play-icon' onClick={() => { setPlayState(true) }} />
        </div>
        <div className="about-right">


          <h2>Sharp Tech Systems</h2>
          <p>Sharp Tech Systems Pvt Ltd is a pioneering company
            with over 15 years  of experience specializing in
            Software
            Application, helping students with project, provide
            Software Training along with Title Search services
            and Roof Sketches.  Sharp Tech Systems has consistently
            delivered high-quality solutions to clients towards
            insurance and title search industries. </p>
          <p>With an unwavering commitment to excellence,
            Sharp Tech Systems has become a trusted partner
            for businesses seeking accurate and reliable Title
            Search services and Roof Sketches. Our team of skilled
            professional employees advanced techniques and cutting-edge
            technology to ensure thorough and precise title searches,
            draw Roof Sketches with exact measurements and
            help clients mitigate risks and make informed decisions</p>


          <p>1. Technology Service Provider for Product Development </p>
          <p>2.	Individual Student Project Completion Support. </p>
          <p>3. Software Training and Development</p>
          <p>4. Roof Sketch Services</p>
          <p>5.	Title Search Services </p>
          {/* <Link to="/RoofSketch">  <p>4. Roof Sketch Services</p></Link> */}



        </div>

      </div>

    </div>
  )
}

export default About
