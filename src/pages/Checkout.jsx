import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { motion } from "framer-motion";

const Checkout = () => {
    const navigate = useNavigate();
    const { cart } = useCart();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/login", {
                state: { redirectTo: "/checkout" },
            });
        }
    }, [navigate]);

    const subtotal = useMemo(() => {
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    }, [cart]);

    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;

    const [form, setForm] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
    });

    const [payment, setPayment] = useState("ONLINE");

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const placeOrder = async () => {
        const values = Object.values(form);
        if (values.some(v => v === "")) {
            alert("Please fill all required details");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));

        const order = {
            id: Date.now(),
            userId: user?.id,
            userName: `${form.firstName} ${form.lastName}`,
            email: form.email,
            date: new Date().toISOString(),
            items: cart,
            subtotal,
            total,
            payment,
            address: {
                full: form.address,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
                phone: form.phone,
            },
            status: "Placed",
        };

        if (payment === "COD") {
            try {
                await axios.post("http://localhost:3000/orders", order);
                const orders = JSON.parse(localStorage.getItem("orders")) || [];
                localStorage.setItem("orders", JSON.stringify([order, ...orders]));
                localStorage.removeItem("cart");
                navigate("/order-success", { state: { orderId: order.id, total: order.total, payment: order.payment } });
            } catch (err) {
                alert("Order failed. Please try again.");
            }
        } else {
            const options = {
                key: "rzp_test_SEuOgVHtjeKP97",
                amount: order.total * 100,
                currency: "INR",
                name: "My Store",
                description: "Order Payment",
                handler: async function (response) {
                    const updatedOrder = { ...order, payment: "ONLINE", paymentId: response.razorpay_payment_id, status: "Placed" };
                    try {
                        await axios.post("http://localhost:3000/orders", updatedOrder);
                        const orders = JSON.parse(localStorage.getItem("orders")) || [];
                        localStorage.setItem("orders", JSON.stringify([updatedOrder, ...orders]));
                        localStorage.removeItem("cart");
                        navigate("/order-success", { state: { orderId: updatedOrder.id, total: updatedOrder.total, payment: updatedOrder.payment } });
                    } catch (err) {
                        alert("Payment succeeded but order saving failed. Please contact support.");
                    }
                },
                prefill: { name: `${form.firstName} ${form.lastName}`, email: form.email, contact: form.phone },
                theme: { color: "#e85c7a" },
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        }
    };

    if (!cart || cart.length === 0) return <h2 style={{ padding: 40 }}>Your cart is empty</h2>;

    /* ================= ANIMATION VARIANTS ================= */
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
    };

    /* ================= ROW-WISE WAVE ================= */
    const cardsPerRow = 1; 
    const getRowDelay = (index) => Math.floor(index / cardsPerRow) * 0.1;

    return (
        <div className="checkout container-fluid py-4">
            <div className="row justify-content-center">

                {/* LEFT */}
                <motion.div
                    className="checkout-left col-12 col-lg-7 col-xl-6 mb-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.div className="checkout-box" variants={containerVariants} initial="hidden" animate="show">
                        <h3>Contact</h3>
                        <motion.input name="email" placeholder="Email" onChange={handleChange} variants={itemVariants} />

                        <h3>Delivery</h3>
                        <div className="two-col">
                            <motion.input name="firstName" placeholder="First name" onChange={handleChange} variants={itemVariants} />
                            <motion.input name="lastName" placeholder="Last name" onChange={handleChange} variants={itemVariants} />
                        </div>

                        <motion.input name="address" placeholder="Address" onChange={handleChange} variants={itemVariants} />

                        <div className="three-col">
                            <motion.input name="city" placeholder="City" onChange={handleChange} variants={itemVariants} />
                            <motion.input name="state" placeholder="State" onChange={handleChange} variants={itemVariants} />
                            <motion.input name="pincode" placeholder="PIN code" onChange={handleChange} variants={itemVariants} />
                        </div>

                        <motion.input name="phone" placeholder="Phone" onChange={handleChange} variants={itemVariants} />

                        <h3>Shipping Method</h3>
                        <motion.div className="shipping-box" variants={itemVariants}>
                            Enter your shipping address to view shipping methods.
                        </motion.div>

                        <h3>Payment</h3>
                        <motion.label className="payment-option" variants={itemVariants}>
                            <input type="radio" checked={payment === "ONLINE"} onChange={() => setPayment("ONLINE")} />
                            Pay with UPI, Cards, Net Banking
                        </motion.label>

                        <motion.label className="payment-option" variants={itemVariants}>
                            <input type="radio" checked={payment === "COD"} onChange={() => setPayment("COD")} />
                            Cash on Delivery (COD)
                        </motion.label>

                        <motion.button className="pay-btn" onClick={placeOrder} variants={itemVariants}>
                            Pay now
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* RIGHT */}
                <motion.div
                    className="checkout-right col-12 col-lg-5 col-xl-4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                >
                    <motion.div className="checkout-summary">
                        {cart.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                className="summary-item"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: getRowDelay(index), duration: 0.5, ease: [0.4,0,0.2,1] }}
                            >
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <p>{item.name}</p>
                                    <small>Qty: {item.qty}</small>
                                </div>
                                <p>₹{item.price * item.qty}</p>
                            </motion.div>
                        ))}

                        <motion.input className="coupon" placeholder="Enter discount code" variants={itemVariants} />

                        <motion.div className="price-row" variants={itemVariants}>
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </motion.div>

                        <motion.div className="price-row" variants={itemVariants}>
                            <span>Shipping</span>
                            <span>Free</span>
                        </motion.div>

                        <motion.div className="price-total" variants={itemVariants}>
                            <strong>Total</strong>
                            <strong>₹{total}</strong>
                        </motion.div>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
};

export default Checkout;