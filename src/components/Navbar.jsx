import { Link, useLocation } from "react-router-dom";
import "../Styles/navbar.css";

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="parent">
      {pathname === "/" ? (
        <Link to="/project-wise-data">Project wise Data</Link>
      ) : (
        <>
          {pathname !== "/" && <Link to="/">Home</Link>}

          {pathname !== "/batch-wise-data" && (
            <Link to="/batch-wise-data">Batch wise Data</Link>
          )}

          {pathname !== "/project-wise-data" && (
            <Link to="/project-wise-data">Project wise Data</Link>
          )}
        </>
      )}
    </div>
  );
}

export default Navbar;