import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";

const CartContext = createContext(null);

// Local cart helpers — kept so the cart survives page refresh before backend syncs
const loadLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem("tronix_cart")) || [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  localStorage.setItem("tronix_cart", JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadLocalCart);

  // ─── helpers ────────────────────────────────────────────────────────────────

  const isLoggedIn = () => Boolean(localStorage.getItem("tronix_token"));

  // Push updated cart to backend (fire-and-forget; failures are silent so cart
  // always feels instant to the user).
  const syncCartToBackend = useCallback(async (items) => {
    if (!isLoggedIn()) return;
    try {
      // Re-build the backend cartData map: { productId: { size: qty } }
      const cartData = {};
      for (const item of items) {
        const pid = item._id || item.id;
        const size = item.size || "default";
        if (!cartData[pid]) cartData[pid] = {};
        cartData[pid][size] = item.quantity;
      }
      // We call /api/cart/update for each item; a simpler bulk-replace endpoint
      // would be ideal but isn't available yet — so we push the whole array once.
      await apiRequest("/api/cart/update", {
        method: "POST",
        body: JSON.stringify({
          itemId: items[0]?._id || items[0]?.id,
          quantity: items[0]?.quantity,
          size: items[0]?.size || "default",
        }),
      });
    } catch {
      // Ignore sync errors — local cart is still correct
    }
  }, []);

  // Set cart and persist to localStorage
  const applyCart = useCallback((items) => {
    setCartItems(items);
    saveLocalCart(items);
  }, []);

  // ─── fetch cart from backend after login ─────────────────────────────────

  useEffect(() => {
    const fetchBackendCart = async () => {
      if (!isLoggedIn()) return;
      try {
        const data = await apiRequest("/api/cart/get");
        // cartData from backend: { productId: { size: qty } }
        const backendData = data.cartData || {};
        if (Object.keys(backendData).length === 0) return;

        // Flatten backend map into a local array
        const merged = [];
        for (const [productId, sizes] of Object.entries(backendData)) {
          for (const [size, quantity] of Object.entries(sizes)) {
            if (quantity > 0) {
              // Merge with any local data we have for this product
              const local = cartItems.find(
                (i) => (i._id || i.id) === productId && (i.size || "default") === size
              );
              merged.push({ ...(local || {}), _id: productId, size, quantity });
            }
          }
        }

        if (merged.length > 0) {
          setCartItems(merged);
          saveLocalCart(merged);
        }
      } catch {
        // Backend cart not available — keep local cart
      }
    };

    fetchBackendCart();
    // Only run when the user logs in (token changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── cart actions ────────────────────────────────────────────────────────

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      const pid = product._id || product.id;
      const size = product.size || "default";

      setCartItems((prev) => {
        const existing = prev.find(
          (i) => (i._id || i.id) === pid && (i.size || "default") === size
        );
        const updated = existing
          ? prev.map((i) =>
            (i._id || i.id) === pid && (i.size || "default") === size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
          : [...prev, { ...product, _id: pid, size, quantity }];
        saveLocalCart(updated);
        return updated;
      });

      // Sync to backend
      if (isLoggedIn()) {
        try {
          await apiRequest("/api/cart/add", {
            method: "POST",
            body: JSON.stringify({ itemId: pid, size }),
          });
        } catch {
          // Ignore — local cart is source of truth
        }
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (id, amount, size = "default") => {
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          (item._id || item.id) === id && (item.size || "default") === size
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item
        );
        saveLocalCart(updated);

        // Sync changed item to backend
        const changed = updated.find(
          (i) => (i._id || i.id) === id && (i.size || "default") === size
        );
        if (isLoggedIn() && changed) {
          apiRequest("/api/cart/update", {
            method: "POST",
            body: JSON.stringify({ itemId: id, size, quantity: changed.quantity }),
          }).catch(() => { });
        }

        return updated;
      });
    },
    []
  );

  const removeItem = useCallback((id, size = "default") => {
    setCartItems((prev) => {
      const updated = prev.filter(
        (item) => !((item._id || item.id) === id && (item.size || "default") === size)
      );
      saveLocalCart(updated);

      // Tell backend quantity = 0 → removes it
      if (isLoggedIn()) {
        apiRequest("/api/cart/update", {
          method: "POST",
          body: JSON.stringify({ itemId: id, size, quantity: 0 }),
        }).catch(() => { });
      }

      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    applyCart([]);
  }, [applyCart]);

  // ─── derived values ──────────────────────────────────────────────────────

  const count = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      addToCart,
      cartItems,
      clearCart,
      count,
      removeItem,
      subtotal,
      updateQuantity,
    }),
    [cartItems, addToCart, clearCart, count, removeItem, subtotal, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
