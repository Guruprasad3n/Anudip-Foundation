import React from "react";
import "../Styles/Loader.css";
import image from "../Assets/Anudip.png"

const Loader = () => {
    return (
        <div className="loader-overlay">
            <img src={image} alt="Loading..." className="loader-logo" />
        </div>
    );
};

export default Loader;