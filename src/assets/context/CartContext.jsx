import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const removeFromCart = useCallback((indexToRemove) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((_, index) => index !== indexToRemove);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
