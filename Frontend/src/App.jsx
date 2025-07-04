import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StatePage from "./Pages/StatePage";
import IndiaMap from "./components/IndiaMap";
import Navbar from "./components/Navbar";
import StateBatchWiseData from "./Pages/StateBatchWiseData";
import ProjectWise from "./Pages/ProjectWise";
import PMOWise from "./Pages/PMOWiseData";
import RMWiseData from "./Pages/RMWiseData";
import Loader from "./components/Loader";
import "./App.css";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const statePathParts = location.pathname.split("/");
  const redirectStateName = statePathParts[2];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {!isHomePage && <Navbar />}

          <Routes>
            <Route path="/" element={<IndiaMap />} />
            <Route path="/state/:stateName/centers" element={<StatePage />} />
            <Route path="/state/:stateName/batches" element={<StateBatchWiseData />} />
            <Route path="/project-wise-data" element={<ProjectWise />} />
            <Route path="/pmo-wise-data" element={<PMOWise />} />
            <Route path="/rm-wise-data" element={<RMWiseData />} />
            <Route
              path="/state/:stateName"
              element={<Navigate to={`/state/${redirectStateName}/centers`} />}
            />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;




// import Footer from "./components/Footer";
// import MobilizationGallery from "./Pages/MobilizationGallery";
// import ProjectWiseData from "./Pages/ProjectWiseData";
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import StatePage from "./Pages/StatePage";
// import IndiaMap from "./components/IndiaMap";
// import Navbar from "./components/Navbar";
// import "./App.css";
// import StateBatchWiseData from "./Pages/StateBatchWiseData";
// import ProjectWise from "./Pages/ProjectWise";
// import PMOWise from "./Pages/PMOWiseData";
// import RMWiseData from "./Pages/RMWiseData";

// function App() {
//   const location = useLocation();
//   const isHomePage = location.pathname === "/";
//   const statePathParts = location.pathname.split("/");
//   const redirectStateName = statePathParts[2];

//   return (
//     <>
//       {!isHomePage && <Navbar />}

//       <Routes>
//         <Route path="/" element={<IndiaMap />} />
//         <Route path="/state/:stateName/centers" element={<StatePage />} />


//         <Route path="/state/:stateName/batches" element={<StateBatchWiseData />} />
//         <Route path="/project-wise-data" element={<ProjectWise />} />
//         <Route path="/pmo-wise-data" element={<PMOWise />} />
//         <Route path="/rm-wise-data" element={<RMWiseData />} />

//         <Route
//           path="/state/:stateName"
//           element={<Navigate to={`/state/${redirectStateName}/centers`} />}
//           />
//       </Routes>

//     </>
//   );
// }

// export default App;


{/* <Route path="/mobilization-gallery" element={<MobilizationGallery />} /> */}
{/* <Route path="/state/:stateName/centers" element={<StatePage />} />
 */}
{/* Redirect from /state/:stateName to /state/:stateName/centers */}
{/* {!isHomePage && <Footer />} */}
{/* <Route
  path="/state/:stateName"
  element={<Navigate to={`/state/${redirectStateName}/centers`} />}
/> */}


// import { Routes, Route, useLocation } from "react-router-dom";
// import StatePage from "./Pages/StatePage";
// import IndiaMap from "./components/IndiaMap";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import "./App.css";
// import StateBatchWiseData from "./Pages/StateBatchWiseData";
// import MobilizationGallery from "./Pages/MobilizationGallery";
// import ProjectWiseData from "./Pages/ProjectWiseData";
// import ProjectWise from "./Pages/ProjectWise";
// import PMOWise from "./Pages/PMOWiseData";
// import RMWiseData from "./Pages/RMWiseData";

// function App() {
//   const location = useLocation();
//   const isHomePage = location.pathname === "/";

//   return (
//     <>
//       {!isHomePage && <Navbar />}

//       <Routes>
//         <Route path="/" element={<IndiaMap />} />
//         <Route path="/mobilization-gallery" element={<MobilizationGallery />} />
//        <Route path="/state/:stateName/centers" element={<StatePage />} />
//         <Route path="/state/:stateName/batches" element={<StateBatchWiseData />} />
//         {/* <Route path="/project-wise-data" element={<ProjectWiseData />} /> */}
//         <Route path="/project-wise-data" element={<ProjectWise />} />
//         <Route path="/pmo-wise-data" element={<PMOWise />} />
//         <Route path="/rm-wise-data" element={<RMWiseData />} />
//       </Routes>

//       {!isHomePage && <Footer />}
//     </>
//   );
// }

// export default App;