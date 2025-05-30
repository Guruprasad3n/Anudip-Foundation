import React from "react";
import "../Styles/Buttons.css"; // Import the CSS file
import logo from "../Assets/Anudip-Logo.png";
import { Link } from "react-router-dom";

const Buttons = () => {
  return (
    <div className="buttons-container">
      <img src={logo} alt="Anudip Logo" className="logo" />
      <div className="buttons-wrapper">
        <Link to="/project-wise-data">
          <button className="custom-button"> Project wise Data </button>
        </Link>
        <Link to="/mobilization-gallery">
          <button className="custom-button"> Mobilization Gallery</button>
        </Link>
      </div>
    </div>
  );
};

export default Buttons;
