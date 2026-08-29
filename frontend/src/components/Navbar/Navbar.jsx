import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <nav>
        <Link to="/">Mann Zariya</Link>

        <div>
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