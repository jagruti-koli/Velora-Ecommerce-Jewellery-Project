import React, { useState } from "react";
import { motion, useViewportScroll, useTransform, AnimatePresence } from "framer-motion";

const founders = [
  {
    name: "Ashish Kapoor",
    title: "Founder & Creative Head",
    img: "/images/founder1.jpg",
    bio: "Visionary behind Velora’s elegant designs — blending everyday luxury with personal meaning."
  },
  {
    name: "Neha Sharma",
    title: "Co-Founder & COO",
    img: "/images/founder2.jpg",
    bio: "Ensuring every piece meets our standards of craftsmanship and quality."
  }
];

const milestones = [
  { year: "2017", text: "Velora launched with a dream to craft jewellery that feels personal." },
  { year: "2019", text: "First curated collection released — loved by modern women everywhere." },
  { year: "2021", text: "Expanded to bespoke pieces and custom design services." },
  { year: "2024", text: "E‑commerce reach broadened worldwide." }
];

const faqs = [
  { q: "How can I place a custom jewellery order?", a: "You can contact us via our website form or email, and our team will guide you through the custom design process." },
  { q: "Do you ship internationally?", a: "Yes, Velora ships worldwide. Shipping charges and delivery times vary based on location." },
  { q: "What is your return policy?", a: "We accept returns within 14 days of delivery for non-custom items in original condition. Custom pieces are non-returnable." },
  { q: "How do I care for my jewellery?", a: "Store pieces separately, avoid exposure to harsh chemicals, and clean gently with a soft cloth." }
];

const About = () => {
  const { scrollY } = useViewportScroll();
  const timelineY = useTransform(scrollY, [0, 600], [0, 40]);
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero relative overflow-hidden">
        <motion.div
          className="about-hero-bg absolute inset-0"
          style={{ backgroundImage: "url('/images/herobanner/editorial4.png')" }}
        />
        <motion.div
          className="about-hero-content text-center py-32 text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>About Velora</h1>
          <p>Jewellery crafted for the woman who lives life with grace and joy.</p>
        </motion.div>
      </section>

      {/* STORY */}
      <section className="about-section text-center max-w-4xl mx-auto px-4 py-16">
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Our Story</motion.h2>
        <motion.p className="mt-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          At Velora, we believe jewellery isn’t just an accessory — it’s an expression of identity and emotion. Each piece is designed to celebrate moments both grand and subtle.
        </motion.p>
      </section>

      {/* FOUNDERS */}
      <section className="founder-section py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-16 px-4">
          {founders.map((f, i) => (
            <motion.div
              key={i}
              className={`founder-row flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.img
                src={f.img}
                alt={f.name}
                className="founder-img w-full md:w-1/2 max-w-sm rounded-xl shadow-lg object-cover"
              />
              <motion.div
                className="founder-text md:w-1/2 text-center md:text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold">{f.name}</h3>
                <p className="text-pink-500 font-medium mb-2">{f.title}</p>
                <p className="text-gray-700">{f.bio}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values py-20 text-center">
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>What We Believe In</motion.h2>
        <div className="values-grid grid md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 mt-10">
          {["Craftsmanship", "Authenticity", "Modern Elegance"].map((v, idx) => (
            <motion.div
              key={idx}
              className="value-card p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-lg mb-2">{v}</h4>
              <p>Jewellery that embodies quality, integrity, and timeless design.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="about-timeline bg-white py-20">
        <h2 className="section-title text-center mb-10">Our Journey</h2>
        <div className="timeline-container max-w-4xl mx-auto relative px-4">
          <motion.div
            className="timeline-line absolute left-1/2 transform -translate-x-1/2 border-l-2 border-pink-300 h-full"
            style={{ y: timelineY }}
          />
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              className={`timeline-item flex flex-col md:flex-row items-center gap-4 ${i % 2 !== 0 ? "md:flex-row-reverse text-right" : ""}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                className="timeline-year bg-pink-500 text-white font-bold text-lg"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                {m.year}
              </motion.div>
              <motion.div
                className="timeline-text text-gray-700 max-w-md"
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                {m.text}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="about-faq bg-gray-50 py-20">
        <h2 className="section-title text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              className="faq-item border border-gray-200 rounded-lg p-5 bg-white shadow-sm cursor-pointer"
              onClick={() => toggleFAQ(idx)}
            >
              <h4 className="font-semibold text-lg mb-2 flex justify-between items-center">
                {faq.q}
                <motion.span
                  animate={{ rotate: openFAQ === idx ? 45 : 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-pink-500 block text-3xl"
                >
                  +
                </motion.span>
              </h4>
              <AnimatePresence>
                {openFAQ === idx && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <p className="mt-3 text-gray-700">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;