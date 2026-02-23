import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { FaGem } from "react-icons/fa";

import LoginModal from "./LoginModal";

const Navbar = () => {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const { user, admin, logout, adminLogout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      document
        .querySelector(".main-navbar")
        ?.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    if (user) logout();
    if (admin) adminLogout();
    setProfileOpen(false);
    setToast("Logged out successfully");
    setTimeout(() => setToast(""), 2500);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim().toLowerCase());
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/products", {
          signal: controller.signal,
        });
        const data = await res.json();

        const exact = data.filter(
          (p) => p.title.toLowerCase() === debounced
        );

        const partial = data.filter(
          (p) =>
            p.title.toLowerCase().includes(debounced) &&
            p.title.toLowerCase() !== debounced
        );

        setResults([...exact, ...partial].slice(0, 5));
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [debounced]);

  const submitSearch = (value) => {
    if (!value) return;
    navigate(`/products?search=${value}`);
    setShowDropdown(false);
    setSearch("");
    setMobileOpen(false);
  };

  const highlight = (text) => {
    const parts = text.split(new RegExp(`(${debounced})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === debounced ? <mark key={i}>{p}</mark> : p
    );
  };

  return (
    <>
      <LoginModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        showToast={(m) => {
          setToast(m);
          setTimeout(() => setToast(""), 2500);
        }}
      />

      <div className="top-strip">
        <marquee>Flat 50% Off on Select Silver Jewellery</marquee>
      </div>

      <header className="main-navbar fixed-top">
        <div className="container-fluid px-4">
          <div className="navbar-row">
            {/* LEFT */}
            <div className="nav-left">
              <button
                className="menu-btn d-lg-none"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <FiMenu size={22} />
              </button>

              <Link to="/" className="logo">
                <FaGem /> VELORA
              </Link>
            </div>

            {/* SEARCH */}
            <div className="nav-search-wrapper" ref={searchRef}>
              <form
                className="nav-search d-none d-md-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch(search);
                }}
              >
                <FiSearch />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jewellery…"
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown")
                      setActiveIndex((i) =>
                        i < results.length - 1 ? i + 1 : i
                      );
                    if (e.key === "ArrowUp")
                      setActiveIndex((i) => (i > 0 ? i - 1 : -1));
                    if (e.key === "Enter" && activeIndex >= 0) {
                      submitSearch(results[activeIndex].title);
                    }
                  }}
                />
              </form>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="search-dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {loading && <div className="no-result">Searching…</div>}

                    {!loading &&
                      results.map((p, i) => (
                        <div
                          key={p.id}
                          className={`search-item ${i === activeIndex ? "active" : ""
                            }`}
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => submitSearch(p.title)}
                        >
                          <strong>{highlight(p.title)}</strong>
                          <span>{p.category}</span>
                        </div>
                      ))}

                    {!loading && results.length === 0 && (
                      <div className="no-result">
                        No product found for “{debounced}”
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT ICONS */}
            <div className="nav-icons">
              <div ref={profileRef} className="position-relative">
                {user ? (
                  <div
                    className="profile-avatar"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <FiUser size={20} onClick={() => setModalOpen(true)} />
                )}

                {profileOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {user && (
                      <>
                        <Link to="/orders">My Orders</Link>
                        <button onClick={handleLogout}>Logout</button>
                      </>
                    )}
                    {admin && (
                      <>
                        <Link to="/admin/dashboard">Admin Panel</Link>
                        <button onClick={handleLogout}>Logout</button>
                      </>
                    )}
                  </motion.div>
                )}
              </div>

              <Link to="/wishlist" className="icon-badge">
                <FiHeart />
                {wishlist.length > 0 && (
                  <span className="badge-count">{wishlist.length}</span>
                )}
              </Link>

              <Link to="/cart" className="icon-badge">
                <FiShoppingBag />
                {cart.length > 0 && (
                  <span className="badge-count">{cart.length}</span>
                )}
              </Link>
            </div>
          </div>

          {/* DESKTOP LINKS */}
          <nav className="category-bar d-none d-lg-flex">
            <ul>
              <li><Link to="/products">All Jewellery</Link></li>
              <li><Link to="/women-collection">Women's Collection</Link></li>
              <li><Link to="/mens-collection">Men's Collection</Link></li>
              <li><Link to="/about">More about Velora</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
          >
            <div className="drawer-header">
            <Link to="/" className="logo">
                <FaGem /> VELORA
              </Link>
              <button
                className="drawer-close-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <FiX size={22} />
              </button>
            </div>

            <form
              className="mobile-search"
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(search);
              }}
            >
              <input
                placeholder="Search jewellery…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <ul>
              <li><Link to="/products">All Jewellery</Link></li>
              <li><Link to="/women-collection">Women's Collection</Link></li>
              <li><Link to="/mens-collection">Men's Collection</Link></li>
              <li><Link to="/about">More about Velora</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && <div className="nav-toast">{toast}</div>}
    </>
  );
};

export default Navbar; 