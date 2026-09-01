import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { loginCustomer } from "../../services/customerAuth";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [cartCount, setCartCount] = useState(0);
  const { cartCount } = useContext(CartContext);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // useEffect(() => {
  //   async function loadCartCount() {
  //     try {
  //       const cartId = localStorage.getItem("shopify_cart_id");

  //       if (!cartId) {
  //         setCartCount(0);
  //         return;
  //       }

  //       const cart = await getCart(cartId);

  //       const totalItems = cart.lines.edges.reduce(
  //         (total, { node }) => total + node.quantity,
  //         0
  //       );

  //       setCartCount(totalItems);
  //     } catch (error) {
  //       console.error("Unable to load cart count:", error);
  //       setCartCount(0);
  //     }
  //   }

  //   loadCartCount();
  // }, []);

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Mann Zariya
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">
            Cart
            {cartCount > 0 && (
              <span className="cart-count">({cartCount})</span>
            )}
          </Link>
          <button
            type="button"
            className="navbar-account-button"
            onClick={loginCustomer}
          >
            Account
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/shop" onClick={closeMenu}>
          Shop
        </Link>

        <Link to="/about" onClick={closeMenu}>
          About
        </Link>

        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>

        <Link to="/cart" onClick={closeMenu}>
          Cart
          {cartCount > 0 && (
            <span className="cart-count">({cartCount})</span>
          )}
        </Link>
        
        <button
          type="button"
          className="mobile-account-button"
          onClick={() => {
            closeMenu();
            loginCustomer();
          }}
        >
          Account
        </button>
      </div>
    </header>
  );
}

export default Navbar;