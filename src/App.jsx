import { Router, Routes, Route } from "react-router-dom";
// import Home from './pages/Home';
import StatePage from "./components/StatePage";
import IndiaMap from "./components/IndiaMap";
import Navbar from "./components/Navbar";
import BatchWiseData from "./Pages/BatchWiseData";

function App() {
  return (
 <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<IndiaMap />} />
        <Route path="/state/:stateName" element={<StatePage />} />
        <Route path="/batch-wise-data" element={<BatchWiseData />} />
      </Routes>
 </>
 );
}

export default App;
