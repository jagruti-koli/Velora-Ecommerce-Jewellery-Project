import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderId, total, payment, items = [] } = state || {};

  /* 🔐 Prevent direct access */
  useEffect(() => {
    if (!orderId) navigate("/");
  }, [orderId, navigate]);


  const confettiCount = 50; 
  const confetti = Array.from({ length: confettiCount }, (_, i) => i);

  // Random utility
  const random = (min, max) => Math.random() * (max - min) + min;

  return (
    <div className="success-page" style={{ position: "relative", overflow: "hidden" }}>
      {/* 🎊 Continuous Confetti */}
      {confetti.map((i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            backgroundColor: `hsl(${random(0, 360)}, 80%, 60%)`,
            top: -10,
            left: `${random(0, 100)}%`,
            borderRadius: "50%",
          }}
          animate={{
            y: [0, window.innerHeight + 50], 
            x: [0, random(-50, 50)],        
            rotate: [0, 360],                
            opacity: [1, 0],                
          }}
          transition={{
            duration: random(2, 4),
            ease: "easeOut",
            repeat: Infinity,                
            repeatDelay: random(0, 1),
          }}
        />
      ))}

      {/* Motion for the card fade-in & pop */}
      <motion.div
        className="success-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* ✅ Animated Tick */}
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
        >
          <FaCheckCircle size={60} color="#4BB543" />
        </motion.div>

        <h2>Order Placed Successfully</h2>
        <p className="subtitle">Thank you for choosing Velora 💖</p>

        {/* 📦 ORDER INFO */}
        <div className="order-meta">
          <div>
            <span>Order ID</span>
            <strong>#{orderId}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>{payment}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>
        </div>

        {/* 🛍 ORDER ITEMS */}
        <div className="order-items">
          <h4>Order Summary</h4>

          {items.map((item, i) => (
            <motion.div
              key={i}
              className="order-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            >
              <img src={item.image} alt={item.name} />

              <div className="item-info">
                <p className="item-name">{item.name}</p>
                <span>Qty: {item.qty}</span>
              </div>

              <p className="item-price">₹{item.price * item.qty}</p>
            </motion.div>
          ))}
        </div>

        {/* 🚚 MESSAGE */}
        <p className="delivery-msg">
          You’ll receive shipping & tracking updates soon.
        </p>

        {/* 🔘 ACTIONS */}
        <div className="success-actions">
          <motion.button
            className="btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </motion.button>

          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/orders")}
          >
            View Orders
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
