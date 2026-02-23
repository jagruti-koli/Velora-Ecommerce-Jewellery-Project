import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Footer = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footerTop = document.getElementById("footer")?.offsetTop;
      const scrollPos = window.scrollY + window.innerHeight;
      if (footerTop && scrollPos > footerTop - 100) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.footer
      id="footer"
      className={`footer ${visible ? "visible" : ""}`}
      variants={containerVariant}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <div className="container">
        <div className="footer-container row text-center text-md-start">

          {/* Logo & About */}
          <motion.div
            className="footer-col about col-12 col-md-4 mb-4"
            variants={itemVariant}
          >
            <h2>VELORA</h2>
            <p>
              Premium jewelry crafted for elegance and style. Timeless designs
              to celebrate every moment.
            </p>

            <div className="social-icons d-flex justify-content-center justify-content-md-start gap-3">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
                (Icon, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    className="social-icon"
                    whileHover={{ scale: 1.15, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon />
                  </motion.a>
                )
              )}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="footer-col links col-12 col-md-4 mb-4"
            variants={itemVariant}
          >
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              {[
                "Home",
                "Collection",
                "Mens in silver",
                "More about Velora",
                "FAQ",
              ].map((link, i) => (
                <motion.li key={i} whileHover={{ x: 6 }}>
                  <a href="#">{link}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="footer-col newsletter col-12 col-md-4 mb-4"
            variants={itemVariant}
          >
            <h5>Subscribe</h5>
            <p>Get updates on latest products and offers.</p>

            <motion.div
              className="subscribe-form d-flex flex-column flex-sm-row gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <input type="email" placeholder="Your email" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.div>
          </motion.div>

        </div>

        <motion.div
          className="footer-bottom text-center mt-3"
          variants={itemVariant}
        >
          &copy; {new Date().getFullYear()} Velora Jewelry. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
