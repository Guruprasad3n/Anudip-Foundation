import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import StatePage from "./Pages/StatePage";
import IndiaMap from "./components/IndiaMap";
import Navbar from "./components/Navbar";
import StateBatchWiseData from "./Pages/StateBatchWiseData";
import ProjectWise from "./Pages/ProjectWise";
import PMOWise from "./Pages/PMOWiseData";
import RMWiseData from "./Pages/RMWiseData";
import Loader from "./components/Loader";
import "./App.css";
import CollapsibleSidebar from "./components/CollapsibleSidebar";
import VerticalPage from "./Pages/VerticalData";
import ErrorPage from "./components/ErrorPage";
import ComparisonPage from "./Pages/ComparisonPage";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const statePathParts = location.pathname.split("/");
  const redirectStateName = statePathParts[2];

  return (
    <>
      {/* <Loader /> */}
      {/* <CollapsibleSidebar /> */}
      {!isHomePage && <Navbar />}

      <div className={isHomePage ? "map-home" : ""}>
        <Routes>
          <Route path="/" element={<IndiaMap />} />
          <Route path="/state/:stateName/centers" element={<StatePage />} />
          <Route path="/state/:stateName/batches" element={<StateBatchWiseData />} />
          <Route path="/project-wise-data" element={<ProjectWise />} />
          <Route path="/pmo-wise-data" element={<PMOWise />} />
          <Route path="/rm-wise-data" element={<RMWiseData />} />
          <Route path="/vertical/:verticalName" element={<VerticalPage />} />
          <Route
            path="/state/:stateName"
            element={<Navigate to={`/state/${redirectStateName}/centers`} />}
          />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

