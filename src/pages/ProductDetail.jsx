import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel, Scrollbar } from "swiper/modules";
import "swiper/css";

import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaBolt,
  FaStar,
  FaCheckCircle,
  FaTruck,
} from "react-icons/fa";

import { motion, useInView } from "framer-motion";

import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

/* ================= SCROLL RE-ANIMATE WRAPPER ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const ScrollReanimate = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.25,
    once: false, // 🔄 re-animate on scroll up/down
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};
/* ============================================================= */

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products } = useProducts();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  /* ================= SAFE PRODUCT LIST ================= */
  const productList = useMemo(() => {
    if (Array.isArray(products)) return products;
    if (products?.data && Array.isArray(products.data)) return products.data;
    return [];
  }, [products]);

  /* ================= CURRENT PRODUCT ================= */
  const product = useMemo(
    () => productList.find((p) => String(p.id) === String(id)),
    [productList, id]
  );

  /* ================= IMAGE GALLERY ================= */
  const images = product?.images?.length
    ? product.images
    : product?.image
    ? [product.image]
    : [];

  const [activeImg, setActiveImg] = useState(0);

  /* ================= PINCODE ================= */
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryMsg("Delivery available in 3–5 working days");
    } else {
      setDeliveryMsg("Please enter a valid 6-digit pincode");
    }
  };

  /* ================= REVIEWS ================= */
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!product) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const collected = [];

    orders.forEach((order) => {
      if (order.status === "Delivered") {
        order.items?.forEach((item) => {
          if (
            String(item.id) === String(product.id) &&
            item.rating &&
            item.review
          ) {
            collected.push({
              rating: item.rating,
              review: item.review,
              user: order.user || "Verified Buyer",
              date: order.date,
            });
          }
        });
      }
    });

    setReviews(collected);
  }, [product]);

  /* ================= RECENTLY VIEWED ================= */
  useEffect(() => {
    if (!product) return;

    const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const updated = [product, ...viewed.filter((p) => p.id !== product.id)].slice(
      0,
      8
    );

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [product]);

  const recentlyViewed = useMemo(() => {
    return JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  }, [product]);

  /* ================= RELATED PRODUCTS ================= */
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return productList.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
  }, [productList, product]);

  const inCart = isInCart(product?.id);
  const liked = isInWishlist(product?.id);

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    if (!inCart) addToCart(product);
    navigate("/checkout");
  };

  /* ================= LOADING ================= */
  if (!product) {
    return (
      <div className="container my-5">
        <div className="skeleton" style={{ height: 420 }} />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">

        {/* ================= PRODUCT INFO ================= */}
        <ScrollReanimate>
          <div className="pd-wrapper">
            <div className="pd-image-box">
              <motion.img
                src={images[activeImg]}
                alt={product.name}
                className="pd-main-img"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="pd-info">
              <h1>{product.name}</h1>

              <div className="pd-rating">
                <FaStar /> {product.rating || 4.7} ({reviews.length} Reviews)
              </div>

              <div className="pd-price">
                ₹{product.price}
                {product.originalPrice && <span>₹{product.originalPrice}</span>}
              </div>

              <div className="pd-tax">Inclusive of all taxes</div>

              <div className="pd-delivery">
                <FaTruck />
                <input
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <button onClick={checkDelivery}>Check</button>
                {deliveryMsg && <p>{deliveryMsg}</p>}
              </div>

              <div className="pd-actions">
                <button className="pd-add-cart" onClick={handleBuyNow}>
                  <FaBolt /> Buy Now
                </button>

                <button
                  className="pd-add-cart"
                  disabled={inCart}
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart />
                  {inCart ? " Added to Cart" : " Add to Cart"}
                </button>

                <button
                  className="pd-wishlist"
                  onClick={() =>
                    liked
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product)
                  }
                >
                  {liked ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              <div className="pd-features">
                <div><FaCheckCircle /> 925 Sterling Silver</div>
                <div><FaCheckCircle /> 6-Month Warranty</div>
                <div><FaCheckCircle /> Skin Safe</div>
                <div><FaCheckCircle /> Easy Returns</div>
              </div>
            </div>
          </div>
        </ScrollReanimate>

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <ScrollReanimate delay={0.1}>
            <div className="similar-section">
              <h3>You may also like</h3>
              <Swiper
                modules={[Navigation, Mousewheel, Scrollbar]}
                slidesPerView={4}
                spaceBetween={14}
                mousewheel={{ forceToAxis: true }}
              >
                {relatedProducts.map((item) => (
                  <SwiperSlide key={item.id}>
                    <ProductCard product={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </ScrollReanimate>
        )}

        {/* ================= RECENTLY VIEWED ================= */}
        {recentlyViewed.length > 1 && (
          <ScrollReanimate delay={0.15}>
            <div className="similar-section">
              <h3>Recently Viewed</h3>
              <Swiper
                modules={[Navigation, Mousewheel, Scrollbar]}
                slidesPerView={4}
                spaceBetween={14}
                mousewheel={{ forceToAxis: true }}
              >
                {recentlyViewed
                  .filter((p) => p.id !== product.id)
                  .map((item) => (
                    <SwiperSlide key={item.id}>
                      <ProductCard product={item} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </ScrollReanimate>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;