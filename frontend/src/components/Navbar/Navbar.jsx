import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="navbar-logo">
          Mann Zariya
        </Link>

        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;