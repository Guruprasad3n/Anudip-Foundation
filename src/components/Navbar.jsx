import { Link, useLocation } from "react-router-dom";
import "../Styles/navbar.css";
import AnudipLogo from "../Assets/Anudip-Logo.png";

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  const matchState = pathname.match(/^\/state\/([^\/]+)/);
  const stateName = matchState ? matchState[1] : null;

  return (
    <div className="parent">
      <div className="logo-container">
        <Link to={"/"}> <img src={AnudipLogo} alt="Anudip Logo" className="logo" /></Link>
      </div>

      <div className="links-container">
        {pathname === "/" ? (
          <Link to="/project-wise-data">Project wise Data</Link>
        ) : (
          <>
            {pathname !== "/" && <Link to="/">Home</Link>}

            {pathname !== "/mobilization-gallery" && (
              <Link to="/mobilization-gallery">Mobilization Gallery</Link>
            )}

            {pathname !== "/project-wise-data" && (
              <Link to="/project-wise-data">Project wise Data</Link>
            )}

            {stateName && (
              <>
                {/* Future state-specific links */}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;