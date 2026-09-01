import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCart,
  updateCartLine,
  removeCartLine,
} from "../../services/shopify";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const { setCart: setGlobalCart } = useContext(CartContext);
  const [cart, setCart] = useState(null);
  const [updatingLine, setUpdatingLine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCart() {
      try {
        const cartId = localStorage.getItem("shopify_cart_id");

        if (!cartId) {
          setCart(null);
          return;
        }

        const data = await getCart(cartId);

        setCart(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load your cart.");
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

    async function changeQuantity(lineId, currentQuantity, change) {
        const cartId = localStorage.getItem("shopify_cart_id");

        if (!cartId) return;

        const newQuantity = currentQuantity + change;

        if (newQuantity < 1) return;

        try {
            setUpdatingLine(lineId);

            const updatedCart = await updateCartLine(
            cartId,
            lineId,
            newQuantity
            );

            setCart(updatedCart);
            setGlobalCart(updatedCart);
        } catch (error) {
            console.error(error);
            setError("Unable to update cart.");
        } finally {
            setUpdatingLine(null);
        }
    }

    async function removeItem(lineId) {
        const cartId = localStorage.getItem("shopify_cart_id");

        if (!cartId) return;

        try {
            setUpdatingLine(lineId);

            const updatedCart = await removeCartLine(
            cartId,
            lineId
            );

            setCart(updatedCart);
            setGlobalCart(updatedCart);
        } catch (error) {
            console.error(error);
            setError("Unable to remove item.");
        } finally {
            setUpdatingLine(null);
        }
    }

  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <p>Loading cart...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  const cartLines = cart?.lines?.edges || [];

  if (cartLines.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <p className="section-eyebrow">YOUR CART</p>

          <h1>Your cart is empty.</h1>

          <Link to="/shop" className="cart-shop-link">
            Continue Shopping →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <p className="section-eyebrow">YOUR CART</p>

        <h1>Shopping Bag</h1>

        <div className="cart-items">
          {cartLines.map(({ node: line }) => {
            const variant = line.merchandise;

            return (
              <div className="cart-item" key={line.id}>
                {variant.image && (
                  <img
                    src={variant.image.url}
                    alt={variant.image.altText || variant.product.title}
                    className="cart-item-image"
                  />
                )}

                <div className="cart-item-info">
                    <h2>{variant.product.title}</h2>

                    <p>Size: {variant.title}</p>

                    <div className="cart-item-actions">
                    <div className="cart-quantity">
                        <button
                        type="button"
                        onClick={() =>
                            changeQuantity(
                            line.id,
                            line.quantity,
                            -1
                            )
                        }
                        disabled={updatingLine === line.id}
                        >
                        −
                        </button>

                        <span>{line.quantity}</span>

                        <button
                        type="button"
                        onClick={() =>
                            changeQuantity(
                            line.id,
                            line.quantity,
                            1
                            )
                        }
                        disabled={updatingLine === line.id}
                        >
                        +
                        </button>
                    </div>

                    <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() => removeItem(line.id)}
                        disabled={updatingLine === line.id}
                    >
                        Remove
                    </button>
                    </div>

                    <p className="cart-item-price">
                    ₹{" "}
                    {Number(
                        variant.price.amount
                    ).toLocaleString("en-IN")}
                    </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
            <p>
                Total: ₹{" "}
                {Number(
                cart.cost.totalAmount.amount
                ).toLocaleString("en-IN")}
            </p>

            <button
                type="button"
                className="cart-checkout-button"
                onClick={() => {
                    const checkoutUrl = new URL(cart.checkoutUrl);

                    checkoutUrl.searchParams.set("sso", "silent");

                    window.location.href = checkoutUrl.toString();
                }}
            >
                Proceed to Checkout →
            </button>
        </div>
      </div>
    </main>
  );
}

export default Cart;