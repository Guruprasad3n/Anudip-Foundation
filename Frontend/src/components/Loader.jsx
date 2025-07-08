import React from "react";
import "../Styles/Loader.css";
import logo from "../Assets/Anudip.png";

const Loader = () => {
  return (
    <div className="circle-loader-container">
      <div className="outer-ring"></div> {/* 🚨 Move this OUTSIDE */}
      <div className="circle-clip">
        <img src={logo} alt="Anudip Logo" className="circle-logo" />
        <div className="wave-layer wave1"></div>
        <div className="wave-layer wave2"></div>
      </div>
    </div>
  );
};

export default Loader;


// import React from "react";
// import "../Styles/Loader.css";
// import image from "../Assets/Anudip.png"

// const Loader = () => {
//     return (
//         <div className="loader-overlay">
//             <img src={image} alt="Loading..." className="loader-logo" />
//         </div>
//     );
// };

// export default Loader;