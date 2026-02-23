import React, { useContext } from "react";
import Carousel from "../components/Carousal";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../context/ProductContext.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Scroll animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Hover animation for cards
const hoverEffect = {
  whileHover: { scale: 1.05, y: -5, transition: { duration: 0.3 } },
};

const Home = () => {
  const { products, loading } = useContext(ProductContext);

  if (loading)
    return <p className="text-center mt-5">Loading products...</p>;

  const womenCategories = ["rings", "earrings", "necklaces", "bracelets"];
  const menCategories = ["rings", "chains", "bracelets", "earrings"];

  const getCategoryImage = (gender, category) => {
    const product = products.find((p) =>
      p.category?.toLowerCase().includes(
        `${gender} - ${category}`.toLowerCase()
      )
    );
    return product?.image || "/images/placeholder.webp";
  };

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const trendingProducts = products.slice(0, 12);

  return (
    <>
      {/* ================= HERO ================= */}
      <Carousel />

      {/* ================= WOMEN CATEGORIES ================= */}
      <section className="home-section container py-4 py-md-5">
        <div className="section-header text-center text-md-start">
          <h2 className="section-title text-center">Shop Jewellery for Women</h2>
          <p className="section-subtitle text-center">
            Everyday elegance crafted in silver & gold
          </p>
        </div>

        <div className="row g-3 g-md-4 mt-2">
          {womenCategories.map((cat, i) => (
            <motion.div
              className="col-6 col-sm-6 col-lg-3"
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              {...hoverEffect}
            >
              <Link
                to={`/products?gender=women&category=${cat}`}
                className="category-card d-block h-100"
              >
                <img
                  src={getCategoryImage("women", cat)}
                  alt={cat}
                  className="img-fluid"
                />
                <div className="category-overlay">
                  <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MEN CATEGORIES ================= */}
      <section className="home-section light-bg py-4 py-md-5">
        <div className="container">
          <div className="section-header text-md-start">
            <h2 className="section-title text-center">Men’s Silver Jewellery</h2>
            <p className="section-subtitle text-center">Minimal. Masculine. Modern.</p>
          </div>

          <div className="row g-3 g-md-4 mt-2">
            {menCategories.map((cat, i) => (
              <motion.div
                className="col-6 col-sm-6 col-lg-3"
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                {...hoverEffect}
              >
                <Link
                  to={`/products?gender=men&category=${cat}`}
                  className="category-card d-block h-100"
                >
                  <img
                    src={getCategoryImage("men", cat)}
                    alt={cat}
                    className="img-fluid"
                  />
                  <div className="category-overlay">
                    <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EDITORIAL BANNER ================= */}
      <motion.section
        className="editorial-banner festival-diwali d-flex align-items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="editorial-inner container text-center text-md-start">
          <div className="editorial-content">
            <h2>Jewellery that tells your story</h2>
            <p>Designed for everyday elegance. Crafted with love, styled for you.</p>
            <Link to="/collections" className="editorial-btn">
              Explore Collection
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ================= FEATURED ================= */}
      <section className="home-section container py-4 py-md-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 text-center text-md-start">
          <div>
            <h2 className="section-title">Featured Picks</h2>
            <p className="section-subtitle text-center">Our most loved designs this season</p>
          </div>
          <Link to="/products" className="view-all mt-3 mt-md-0">
            View All →
          </Link>
        </div>

        <div className="row g-3 g-md-4">
          {featuredProducts.map((product) => (
            <motion.div
              className="col-6 col-sm-6 col-lg-3"
              key={product.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              {...hoverEffect}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TRENDING ================= */}
      <section className="home-section container py-4 py-md-5">
        <div className="section-header text-center text-md-start">
          <h2 className="section-title text-center">Trending & New Arrivals</h2>
          <p className="section-subtitle text-center">Fresh designs crafted for modern styling</p>
        </div>

        <div className="row g-3 g-md-4 mt-3">
          {trendingProducts.map((product) => (
            <motion.div
              className="col-6 col-sm-6 col-lg-3"
              key={product.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              {...hoverEffect}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= BEST SELLERS ================= */}
      <section className="home-section best-sellers py-4 py-md-5">
        <div className="container">
          <div className="section-header text-center mb-4">
            <h2 className="section-title text-center">Best Sellers</h2>
            <p className="section-subtitle text-center">Loved by thousands, styled every day</p>
          </div>

          <div className="row g-3 g-md-4">
            {products
              .filter((p) => p.bestSeller)
              .slice(0, 8)
              .map((product) => (
                <motion.div
                  className="col-6 col-md-4 col-lg-3"
                  key={product.id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  {...hoverEffect}
                >
                  <div className="best-seller-card h-100">
                    <ProductCard product={product} />
                    <span className="best-badge">Best Seller</span>
                  </div>
                </motion.div>
              ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/products" className="view-all-btn">
              View All Best Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* ================= GIFTING MOMENTS ================= */}
      <section className="home-section gifting-section py-4 py-md-5">
        <div className="container">
          <div className="section-header text-center mb-4">
            <h2 className="section-title text-center">Gifting Moments</h2>
            <p className="section-subtitle text-center">Thoughtful jewellery for every special occasion</p>
          </div>

          <div className="row g-3 g-md-4">
            {["anniversary", "birthday", "festive"].map((occasion, i) => (
              <motion.div
                className="col-12 col-md-4"
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                {...hoverEffect}
              >
                <Link to={`/products?occasion=${occasion}`} className="gift-card">
                  <img
                    src={`/images/gift-${occasion}.png`}
                    alt={`${occasion} Gifts`}
                    className="img-fluid"
                  />
                  <div className="gift-overlay">
                    <h4>{occasion.charAt(0).toUpperCase() + occasion.slice(1)}</h4>
                    <span>
                      {occasion === "anniversary"
                        ? "Celebrate love"
                        : occasion === "birthday"
                        ? "Make them smile"
                        : "Shine together"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY VELORA ================= */}
      <motion.section
        className="why-velora py-4 py-md-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container text-center">
          <h2 className="why-title">Why Velora</h2>
          <p className="why-subtitle">Crafted with care. Designed for everyday elegance.</p>

          <div className="row g-4 mt-4">
            {[
              { icon: "💎", title: "Hallmarked Jewellery", text: "Certified purity you can trust, every time." },
              { icon: "🛡", title: "Lifetime Plating", text: "Long-lasting shine with premium finishing." },
              { icon: "🚚", title: "Insured Shipping", text: "Safe & secure delivery to your doorstep." },
              { icon: "↩️", title: "Easy Returns", text: "15 days hassle-free returns & exchanges." },
            ].map((item, i) => (
              <motion.div
                className="col-6 col-md-3"
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                {...hoverEffect}
              >
                <div className="why-card h-100">
                  <span className="why-icon">{item.icon}</span>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= CUSTOMER REVIEWS ================= */}
      <motion.section
        className="home-section reviews-section py-4 py-md-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="section-header text-center mb-4">
            <h2 className="section-title text-center">Loved by 1 Lakh+ Customers</h2>
            <p className="section-subtitle text-center">Real stories from women who shine with us ✨</p>
          </div>

          <div className="reviews-scroll">
            {[
              { stars: "★★★★★", text: "The quality is just amazing. Looks premium and feels so elegant!", user: "Priya S." },
              { stars: "★★★★☆", text: "Perfect gift for my sister. Packaging and finish were top notch.", user: "Ananya R." },
              { stars: "★★★★☆", text: "Very lightweight and classy. Wearing it daily!", user: "Neha K." },
            ].map((rev, i) => (
              <motion.div
                className="review-card"
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                {...hoverEffect}
              >
                <div className="review-stars">{rev.stars}</div>
                <p className="review-text">{rev.text}</p>
                <span className="review-user">{rev.user}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= MOBILE STICKY CTA ================= */}
      <div className="mobile-sticky-cta d-md-none">
        <Link to="/products" className="sticky-btn w-100 text-center">
          Shop Jewellery
        </Link>
      </div>
    </>
  );
};

export default Home;
