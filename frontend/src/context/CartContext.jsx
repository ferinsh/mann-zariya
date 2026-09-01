import { createContext, useEffect, useState } from "react";
import {
  getCart,
  createCart,
  addToCart,
} from "../services/shopify";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        const cartId = localStorage.getItem("shopify_cart_id");

        if (!cartId) {
          setCart(null);
          return;
        }

        const existingCart = await getCart(cartId);

        setCart(existingCart);
      } catch (error) {
        console.error("Unable to load cart:", error);

        localStorage.removeItem("shopify_cart_id");
        setCart(null);
      } finally {
        setLoadingCart(false);
      }
    }

    loadCart();
  }, []);

  async function addItem(variantId, quantity = 1) {
    let updatedCart;

    if (cart?.id) {
      updatedCart = await addToCart(
        cart.id,
        variantId,
        quantity
      );
    } else {
      updatedCart = await createCart(
        variantId,
        quantity
      );

      localStorage.setItem(
        "shopify_cart_id",
        updatedCart.id
      );
    }

    setCart(updatedCart);

    return updatedCart;
  }

  const cartCount =
    cart?.lines?.edges?.reduce(
      (total, { node }) => total + node.quantity,
      0
    ) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        loadingCart,
        cartCount,
        addItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}