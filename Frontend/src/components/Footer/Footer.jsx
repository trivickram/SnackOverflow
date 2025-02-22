import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <h1>BiteBooker</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vero
            praesentium veritatis, repellendus quasi, aperiam aliquam ducimus,
            unde eius dignissimos quisquam obcaecati. Enim quo dolores
            exercitationem. Officia quisquam temporibus deleniti.
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91 9876543210</li>
            <li>contact@BiteBooker.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        &copy; 2024 BiteBooker. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
