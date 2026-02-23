import React, { useContext, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { ProductContext } from "../context/ProductContext.jsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const hoverEffect = {
  whileHover: { scale: 1.05, y: -5, transition: { duration: 0.3 } },
};

const WomenCollection = () => {
  const { products, loading } = useContext(ProductContext);

  const [sortBy, setSortBy] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  /** 🔍 FILTER + SORT LOGIC */
  const womenProducts = useMemo(() => {
    let data = products.filter(
      (p) => p.category?.toLowerCase().includes("women")
    );

    if (priceFilter === "low") data = data.filter((p) => p.price < 2000);
    else if (priceFilter === "high") data = data.filter((p) => p.price >= 2000);

    if (sortBy === "priceLowHigh") data.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow") data.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") data.sort((a, b) => b.rating - a.rating);

    return data;
  }, [products, sortBy, priceFilter]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <>
      {/* ================= WOMEN EDITORIAL ================= */}
      <motion.section
        className="womens-editorial d-flex align-items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="editorial-inner container">
          <div className="editorial-content">
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
              }}
            >
              Jewellery that celebrates modern femininity
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } },
              }}
            >
              Elegant designs crafted for style, grace, and everyday luxury.
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4 } },
              }}
            >
              <Link to="/products?gender=women" className="editorial-btn">
                Explore Women’s Collection
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="container py-4">
      <div className="section-header mb-4">
          <h2 className="section-title">Women’s Collection</h2>
          <p className="section-subtitle">Minimal. Masculine. Modern.</p>
        </div>
        {/* ================= PRODUCTS ================= */}
        <div className="row g-3 g-md-4 mt-2">
          {womenProducts.map((product) => (
            <motion.div
              className="col-6 col-md-4 col-lg-3"
              key={product.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              {...hoverEffect}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default WomenCollection;