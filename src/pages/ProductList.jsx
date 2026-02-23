import React, { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

const categories = ["All", "Rings", "Earrings", "Necklaces", "Bracelets", "Chains"];

const sortOptions = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

/* ================= ROW-WISE DIRECTION-AWARE ANIMATION ================= */
const getCardVariants = (scrollDirection) => ({
  hidden: { 
    opacity: 0, 
    y: scrollDirection === "down" ? 50 : -50, 
    scale: 0.95 
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("");

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    material: [],
  });

  const [scrollDirection, setScrollDirection] = useState("down");

  const location = useLocation();
  const normalize = (text = "") => text.toLowerCase().replace(/[-_\s]/g, "");

  /* ================= SCROLL DIRECTION TRACKER ================= */
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setScrollDirection("down");
      else if (window.scrollY < lastScrollY) setScrollDirection("up");
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setError("Unable to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ================= FILTER + SORT ================= */
  useEffect(() => {
    let list = [...products];
    const categoryParam = new URLSearchParams(location.search).get("category");

    if (categoryParam) {
      setActiveCategory(categoryParam);
      if (normalize(categoryParam) !== "all") {
        list = list.filter((product) => {
          const extracted = product.category?.split("-").pop().trim();
          return normalize(extracted) === normalize(categoryParam);
        });
      }
    } else if (normalize(activeCategory) !== "all") {
      list = list.filter((product) => {
        const extracted = product.category?.split("-").pop().trim();
        return normalize(extracted) === normalize(activeCategory);
      });
    }

    if (filters.material.length > 0) {
      list = list.filter((p) => filters.material.includes(p.material));
    }

    list = list.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (activeSort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (activeSort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (activeSort === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredProducts(list);
  }, [location.search, products, activeCategory, activeSort, filters]);

  const appliedFilterCount = filters.material.length + (filters.priceRange[1] < 50000 ? 1 : 0);

  /* ================= SKELETON LOADING ================= */
  if (loading) {
    return (
      <div className="container my-5">
        <div className="row g-3 g-md-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col-6 col-sm-6 col-md-4 col-lg-3">
              <div className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-text" />
                <div className="skeleton-text small" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  /* ================= CALCULATE ROW-WISE STAGGER ================= */
  const cardsPerRow = 4; // matches your bootstrap grid: col-lg-3 = 4 cards per row
  const getRowDelay = (index) => {
    const row = Math.floor(index / cardsPerRow);
    return row * 0.1 * (scrollDirection === "down" ? 1 : -1); // reverse delay when scrolling up
  };

  return (
    <div className="container my-5">
      {/* ================= CATEGORY TABS ================= */}
      <div className="category-tabs-wrapper">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ================= SORT BAR ================= */}
      <div className="sort-bar">
        <button className="filter-btn" onClick={() => setFilterDrawerOpen(true)}>
          ☰ Filters
          {appliedFilterCount > 0 && <span className="filter-badge">{appliedFilterCount}</span>}
        </button>

        <select className="sort-select" value={activeSort} onChange={(e) => setActiveSort(e.target.value)}>
          <option value="">Sort By</option>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ================= FILTER BACKDROP ================= */}
      {filterDrawerOpen && (
        <motion.div
          className="filter-backdrop"
          onClick={() => setFilterDrawerOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* ================= FILTER DRAWER ================= */}
      {filterDrawerOpen && (
        <motion.div
          className="filter-drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="filter-header">
            <h5>Filters</h5>
            <button onClick={() => setFilterDrawerOpen(false)}>✕</button>
          </div>

          <div className="filter-section">
            <h6>Material</h6>
            {["Gold", "Silver", "Platinum"].map((mat) => (
              <label key={mat} className="material-option">
                <input
                  type="checkbox"
                  checked={filters.material.includes(mat)}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      material: prev.material.includes(mat)
                        ? prev.material.filter((m) => m !== mat)
                        : [...prev.material, mat],
                    }))
                  }
                />
                {mat}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h6>Price</h6>
            <input
              type="range"
              min={0}
              max={50000}
              value={filters.priceRange[1]}
              style={{ "--range-progress": `${(filters.priceRange[1] / 50000) * 100}%` }}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priceRange: [0, Number(e.target.value)] }))
              }
            />
            <p>₹{filters.priceRange[0]} – ₹{filters.priceRange[1]}</p>
          </div>

          <div className="filter-footer">
            <button
              className="clear-btn"
              onClick={() => setFilters({ priceRange: [0, 50000], material: [] })}
            >
              Clear All
            </button>
            <button className="apply-btn" onClick={() => setFilterDrawerOpen(false)}>
              Apply
            </button>
          </div>
        </motion.div>
      )}

      {/* ================= PRODUCTS GRID ================= */}
      <div className="row g-3 g-md-4 mt-3">
        {filteredProducts.length ? (
          filteredProducts.map((product, index) => (
            <div className="col-6 col-sm-6 col-md-4 col-lg-3" key={product.id}>
              <motion.div
                variants={getCardVariants(scrollDirection)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: getRowDelay(index) }}
                whileHover={{ scale: 1.05 }}
                style={{ height: "100%" }}
              >
                <ProductCard product={product} />
              </motion.div>
            </div>
          ))
        ) : (
          <p className="text-center mt-5">No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;