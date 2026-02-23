import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create context
const WishlistContext = createContext();

// 2. Provider
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Add product to wishlist
  const addToWishlist = (product) => {
    if (!wishlist.find((p) => p.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter((p) => p.id !== productId));
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// 3. Custom hook for easier usage
export const useWishlist = () => useContext(WishlistContext);
