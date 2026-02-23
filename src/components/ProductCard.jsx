import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const liked = isInWishlist(product.id);

  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const goToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      {/* IMAGE */}
      <div className={`product-image ${product.hoverImage ? "has-hover" : "no-hover"}`} onClick={goToDetails}>
        {/* Front image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="img-main"
        />

        {/* Rating */}
        <div className="rating-pill">
          {(product.rating || 4.7)} ★ | {(product.reviews || 175)}
        </div>

        {/* Wishlist */}
        <button
          className={`wishlist-btn ${liked ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            liked
              ? removeFromWishlist(product.id)
              : addToWishlist(product);
          }}
        >
          ♥
        </button>
      </div>

      {/* CONTENT */}
      <div className="product-info">
        <p className="price">₹{product.price}</p>

        <p className="coupon">
          Get it for <strong>₹{product.price - 120}</strong> with coupon
        </p>

        <button
          className={`cart-btn ${inCart ? "added" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!inCart) addToCart(product);
          }}
          disabled={inCart}
        >
          {inCart ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
