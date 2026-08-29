import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h2>Mann Zariya</h2>

          <p>
            Fashion excellence for everyday success.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Mann Zariya. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;