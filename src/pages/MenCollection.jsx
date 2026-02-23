import React, { useContext, useMemo } from "react";
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

const MenCollection = () => {
  
  const { products, loading } = useContext(ProductContext);

  const menProducts = useMemo(() => {
    return products.filter((p) =>
      p.category?.toLowerCase().includes("men")
    );
  }, [products]);

  
  if (loading) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <>
      {/* MEN EDITORIAL */}
      <motion.section
        className="mens-editorial d-flex align-items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="editorial-inner container">
          <div className="editorial-content">
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Jewellery that defines modern masculinity
            </motion.h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
              }}
            >
              Crafted with style and precision for everyday elegance.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.4 } },
              }}
            >
              <Link to="/products?gender=men" className="editorial-btn">
                Explore Men’s Collection
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* MEN PRODUCTS */}
      <section className="home-section container py-4 py-md-5">
        <div className="section-header mb-4">
          <h2 className="section-title">Men’s Collection</h2>
          <p className="section-subtitle">Minimal. Masculine. Modern.</p>
        </div>

        <div className="row g-3 g-md-4">
          {menProducts.map((product) => (
            <motion.div
              className="col-6 col-sm-6 col-lg-3"
              key={product.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
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

export default MenCollection;