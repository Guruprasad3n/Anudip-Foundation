import { Router, Routes, Route } from "react-router-dom";
import StatePage from "./Pages/StatePage";
import IndiaMap from "./components/IndiaMap";
import Navbar from "./components/Navbar";
import "./App.css"
import StateBatchWiseData from "./Pages/StateBatchWiseData";

function App() {
  return (
 <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<IndiaMap />} />
        <Route path="/state/:stateName" element={<StatePage />} />
        <Route path="/state/:stateName/batches" element={<StateBatchWiseData />} />
      </Routes>
 </>
 );
}

export default App;
