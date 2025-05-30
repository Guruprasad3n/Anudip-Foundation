import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  GalleryHorizontalEnd,
  BarChart,
} from "lucide-react";
import "../Styles/navbar.css";
import AnudipLogo from "../Assets/Anudip-Logo.png";

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const matchState = pathname.match(/^\/state\/([^\/]+)/);
  const stateName = matchState ? matchState[1] : null;

  const isHome = pathname === "/";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="logo-container">
          <Link to="/" onClick={closeMenu} className="logo-link">
            <img src={AnudipLogo} alt="Anudip Logo" className="logo" />
          </Link>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`links-container ${menuOpen ? "show" : ""}`}>
          {!isHome && (
            <Link to="/" onClick={closeMenu}>
              <Home size={16} /> Home
            </Link>
          )}
          {pathname !== "/mobilization-gallery" && (
            <Link to="/mobilization-gallery" onClick={closeMenu}>
              <GalleryHorizontalEnd size={16} /> Mobilization Gallery
            </Link>
          )}
          {pathname !== "/project-wise-data" && (
            <Link to="/project-wise-data" onClick={closeMenu}>
              <BarChart size={16} /> Project wise Data
            </Link>
          )}
          {stateName && <></>}
        </div>
      </div>
    </div>
  );
}

export default Navbar;


