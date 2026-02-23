import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { motion } from "framer-motion";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("wishlist");
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentlyViewed(recent);
  }, []);

  const isWishlistTab = activeTab === "wishlist";
  const dataToShow = isWishlistTab ? wishlist : recentlyViewed;

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container my-5">
      <motion.h2
        className="text-center mb-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUp}
      >
        My Wishlist
      </motion.h2>

      {/* ✅ Tabs */}
      <motion.div
        className="wishlist-tabs text-center mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={fadeUp}
      >
        <button
          className={isWishlistTab ? "active" : ""}
          onClick={() => setActiveTab("wishlist")}
        >
          My Wishlist
        </button>
        <button
          className={!isWishlistTab ? "active" : ""}
          onClick={() => setActiveTab("recent")}
        >
          Recently Viewed
        </button>
      </motion.div>

      <div key={activeTab} className="fade-wrapper">

        {/* ✅ Empty State */}
        {dataToShow.length === 0 ? (
          <motion.div
            className="wishlist-empty text-center py-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeUp}
          >
            <motion.img
              src="/empty-list.png"
              alt="Empty State"
              className="wishlist-heart pulse-animation"
              style={{ width: "120px", marginBottom: "16px" }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            />

            <p className="fw-medium mb-2">
              {isWishlistTab
                ? "Your wishlist is empty"
                : "No recently viewed items"}
            </p>

            <p className="empty-subtext mb-3">
              {isWishlistTab
                ? "Save your favourite jewellery here"
                : "Explore products and they will appear here"}
            </p>

            <motion.button
              className="explore-btn"
              onClick={() => (window.location.href = "/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Shopping →
            </motion.button>
          </motion.div>
        ) : (
          <div className="row g-4">
            {dataToShow.map((product) => (
              <motion.div
                className="col-12 col-sm-6 col-lg-3"
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeUp}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;