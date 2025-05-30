import { Routes, Route, useLocation } from "react-router-dom";
import StatePage from "./Pages/StatePage";
import IndiaMap from "./components/IndiaMap";
import Navbar from "./components/Navbar";
import "./App.css";
import StateBatchWiseData from "./Pages/StateBatchWiseData";
import MobilizationGallery from "./Pages/MobilizationGallery";
import ProjectWiseData from "./Pages/ProjectWiseData";

function App() {
  const location = useLocation();

  return (
    <>
      <div>
        {location.pathname !== "/" && <Navbar />}

        <Routes>
          <Route path="/" element={<IndiaMap />} />
          <Route path="/mobilization-gallery" element={<MobilizationGallery />} />
          <Route path="/state/:stateName" element={<StatePage />} />
          <Route path="/state/:stateName/batches" element={<StateBatchWiseData />} />
          <Route path="/project-wise-data" element={<ProjectWiseData />} />
        </Routes>
      </div>
    </>
  );
}

export default App;