import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

import App from "./App";
import "./index.css";
import "./admin.css"
import "remixicon/fonts/remixicon.css";

import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext.jsx";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </BrowserRouter>
);
