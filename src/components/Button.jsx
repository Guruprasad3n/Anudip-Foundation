import React from "react";
import "../Styles/Buttons.css";
import logo from "../Assets/Anudip-Logo.png";
import { Link } from "react-router-dom";

const Buttons = () => {
  return (
    <div className="buttons-container" style={{ border: "1px solid red" }}>
      <div className="logo-container" style={{ border: "1px solid red" }}>
        <img
          src={logo}
          alt="Anudip Logo"
          className="logo"
          style={{ border: "1px solid red" }}
        />
      </div>
      <div className="buttons-wrapper">
        <Link to="/project-wise-data">
          <button className="custom-button"> Project wise Data </button>
        </Link>
        <Link to="/mobilization-gallery">
          <button className="custom-button"> Mobilization Gallery</button>
        </Link>
      </div>
    </div>
    // <div className="buttons-container" style={{ border: "1px solid red" }}>
    //   <div>
    //     <img
    //       src={logo}
    //       alt="Anudip Logo"
    //       className="logo"
    //       style={{ border: "1px solid red", width: "100%" }}
    //     />
    //   </div>
    //   <div className="buttons-wrapper">
    //     <Link to="/project-wise-data">
    //       <button className="custom-button"> Project wise Data </button>
    //     </Link>
    //     <Link to="/mobilization-gallery">
    //       <button className="custom-button"> Mobilization Gallery</button>
    //     </Link>
    //   </div>
    // </div>
  );
};

export default Buttons;
