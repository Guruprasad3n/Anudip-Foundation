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
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" onClick={closeMenu} className="logo-link">
          <img src={AnudipLogo} alt="Anudip Logo" className="logo" />
        </Link>

        <button
          className="menu-toggle"
          aria-label="Toggle Menu"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`links-container ${menuOpen ? "show" : ""}`}>
          {!isHome && (
            <Link to="/" onClick={closeMenu}>
              <Home size={16} /> Home
            </Link>
          )}
          {pathname !== "/pmo-wise-data" && (
            <Link to="/pmo-wise-data" onClick={closeMenu}>
              <GalleryHorizontalEnd size={16} /> PMO Data
            </Link>
          )}
          {pathname !== "/rm-wise-data" && (
            <Link to="/rm-wise-data" onClick={closeMenu}>
              <BarChart size={16} /> Project-wise Data
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;




