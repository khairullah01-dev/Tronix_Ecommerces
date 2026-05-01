import React, { createContext, useContext, useMemo, useState } from "react";
import { products } from "../data/products";

// CartContext lets all pages share the same cart data.
// Header, product cards, product page, cart page, and checkout can all use this.
const CartContext = createContext(null);

// loadCart reads saved cart from localStorage.
// This keeps cart items after refresh even before backend cart sync is added.
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("tronix_cart")) || [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);

  // saveCart updates both localStorage and React state.
  // This is used by every cart action.
  const saveCart = (items) => {
    localStorage.setItem("tronix_cart", JSON.stringify(items));
    setCartItems(items);
  };

  // addToCart adds a new product.
  // If product already exists, it increases quantity instead of duplicating the row.
  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      saveCart(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
      return;
    }

    saveCart([...cartItems, { ...product, quantity }]);
  };

  // updateQuantity increases or decreases item quantity.
  // Math.max(1, ...) prevents quantity from becoming 0 or negative.
  const updateQuantity = (id, amount) => {
    saveCart(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  // removeItem deletes one product from the cart.
  const removeItem = (id) => {
    saveCart(cartItems.filter((item) => item.id !== id));
  };

  // clearCart is used after successful checkout/order placement.
  const clearCart = () => {
    saveCart([]);
  };

  // enrichedItems fills product details if cart only has id/quantity later.
  // Right now it also protects us if saved localStorage data is missing fields.
  const enrichedItems = cartItems.map((item) => {
    const fallback = products.find((product) => product.id === item.id);
    return { ...fallback, ...item };
  });

  // count is shown in the cart badge in the header.
  const count = enrichedItems.reduce((total, item) => total + item.quantity, 0);

  // subtotal is used on cart and checkout pages.
  const subtotal = enrichedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      addToCart,
      cartItems: enrichedItems,
      clearCart,
      count,
      removeItem,
      subtotal,
      updateQuantity,
    }),
    [cartItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// useCart is a custom hook so components can easily access cart functions/data.
export const useCart = () => useContext(CartContext);
