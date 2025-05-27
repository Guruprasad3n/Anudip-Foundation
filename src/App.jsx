import { Router, Routes, Route } from "react-router-dom";
import StatePage from "./Pages/StatePage";
import IndiaMap from "./components/IndiaMap";
import Navbar from "./components/Navbar";
import "./App.css";
import StateBatchWiseData from "./Pages/StateBatchWiseData";
import MobilizationGallery from "./Pages/MobilizationGallery";

function App() {
  return (
       <>
      <div>
          {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<IndiaMap />} />
          <Route path="/mobilization-gallery" element={<MobilizationGallery />} />
          <Route path="/state/:stateName" element={<StatePage />} />
          <Route
          path="/state/:stateName/batches"
          element={<StateBatchWiseData />}
        />
        </Routes>
      </div>
       </>
   );
}

export default App;
