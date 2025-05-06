import { Router, Routes, Route } from "react-router-dom";
// import Home from './pages/Home';
import StatePage from "./components/StatePage";
import IndiaMap from "./components/IndiaMap";

function App() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<IndiaMap />} />
        <Route path="/state/:stateName" element={<StatePage />} />
      </Routes>
    // </Router>
  );
}

export default App;
