import React from "react";
import { motion } from "framer-motion";
import editorialImg from "/images/herobanner/editorial4.png"; // your image in src/assets

// Sparkles animation
const sparkleStyle = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  background: "radial-gradient(circle, #fff 0%, rgba(255,255,255,0) 70%)",
  position: "absolute",
  pointerEvents: "none",
};

const HeroEditorial = () => {
  const sparkles = Array.from({ length: 15 }, (_, i) => (
    <motion.div
      key={i}
      style={{
        ...sparkleStyle,
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 90}%`,
      }}
      animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        repeatType: "mirror",
        delay: Math.random() * 2,
      }}
    />
  ));

  return (
    <section
      className="hero-editorial-single"
      style={{
        background: `url(${editorialImg}) center top / cover no-repeat`,
        overflow: "hidden",
      }}
    >
      {/* Sparkles */}
      {sparkles}

      <div className="hero-overlay-single">
        <motion.h1
          className="editorial-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Signature Jewellery
        </motion.h1>

        <motion.p
          className="editorial-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Crafted with love and elegance for every moment.
        </motion.p>

        <motion.a
          href="/collections"
          className="editorial-btn"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
        >
          Explore Collection
        </motion.a>
      </div>
    </section>
  );
};

export default HeroEditorial;
