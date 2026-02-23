import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaTruck,
  FaShippingFast,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getAllOrders, updateOrderById } from "../services/orderService";

const steps = ["Placed", "Shipped", "Out for Delivery", "Delivered"];
const ACTIVE_COLOR = "#e85c7a";
const INACTIVE_BG = "#f3f4f6";
const INACTIVE_TEXT = "#9ca3af";

const Order = ({ userId: propUserId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = propUserId || user.id;

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      const userOrders = data.filter((o) => o.userId === userId);
      setOrders(userOrders);
      setLoading(false);
    } catch (err) {
      console.error("Order fetch failed", err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const cancelOrder = async (order) => {
    try {
      const updatedOrder = {
        ...order,
        status: "Cancelled",
        cancelledAt: new Date().toISOString(),
        timeline: [
          ...(order.timeline || []),
          { status: "Cancelled", date: new Date().toISOString() },
        ],
      };
      await updateOrderById(order.id, updatedOrder);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? updatedOrder : o))
      );
    } catch (err) {
      console.error("Cancel failed", err);
      alert("Unable to cancel order");
    }
  };

  const getCurrentStep = (status) =>
    status === "Cancelled" ? 0 : steps.indexOf(status) + 1;

  if (loading) return <p className="text-center mt-5">Loading orders...</p>;
  if (!orders.length)
    return <p className="text-center text-muted mt-5">No orders found</p>;

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">My Orders</h3>

      {orders.map((order) => {
        const currentStep = getCurrentStep(order.status);

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="card mb-4 shadow-sm border-0">
              <div className="card-body">

                {/* ✅ DELIVERED CELEBRATION */}
                <AnimatePresence>
                  {order.status === "Delivered" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: [1, 1.25, 1] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mb-3 d-flex align-items-center gap-2 fw-semibold"
                      style={{ color: "#16a34a" }}
                    >
                      🎉 Order Delivered Successfully
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* HEADER */}
                <div className="d-flex justify-content-between mb-3 flex-wrap">
                  <div>
                    <p className="mb-0 fw-semibold">Order #{order.id}</p>
                    <small className="text-muted">
                      {new Date(order.date).toDateString()}
                    </small>
                  </div>
                  <div className="fw-bold mt-2 mt-md-0">₹{order.total}</div>
                </div>

                {/* TRACKING */}
                {order.status !== "Cancelled" && (
                  <div className="order-tracking d-flex align-items-center mb-4 flex-wrap justify-content-between">
                    <Step active={currentStep >= 1} icon={<FaBoxOpen />} label="Placed" />
                    <Line active={currentStep >= 2} />
                    <Step active={currentStep >= 2} icon={<FaTruck />} label="Shipped" />
                    <Line active={currentStep >= 3} />
                    <Step active={currentStep >= 3} icon={<FaShippingFast />} label="Out for Delivery" />
                    <Line active={currentStep >= 4} />
                    <Step active={currentStep >= 4} icon={<FaCheckCircle />} label="Delivered" />
                  </div>
                )}

                {/* ITEMS */}
                {order.items?.map((item) => (
                  <motion.div
                    key={item.id}
                    className="d-flex align-items-center gap-3 mb-3 flex-wrap"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      width="64"
                      height="64"
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-semibold">{item.name}</p>
                      <small className="text-muted">
                        Qty: {item.qty} • ₹{item.price}
                      </small>
                    </div>
                  </motion.div>
                ))}

                {/* STATUS */}
                <motion.span
                  className="fw-semibold px-2 py-1 rounded d-inline-block"
                  style={{
                    background:
                      order.status === "Delivered"
                        ? "#d1fae5"
                        : order.status === "Cancelled"
                        ? "#fee2e2"
                        : order.status === "Out for Delivery"
                        ? "#fef3c7"
                        : order.status === "Shipped"
                        ? "#bfdbfe"
                        : "#fca5a5",
                    color:
                      order.status === "Delivered"
                        ? "#065f46"
                        : order.status === "Cancelled"
                        ? "#991b1b"
                        : order.status === "Out for Delivery"
                        ? "#92400e"
                        : order.status === "Shipped"
                        ? "#1e3a8a"
                        : "#b91c1c",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.5 }}
                >
                  {order.status}
                </motion.span>

                {/* CANCEL */}
                {order.status === "Placed" && (
                  <motion.div
                    className="mt-3"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowCancelModal(true);
                      }}
                    >
                      Cancel Order
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <motion.div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Cancel Order</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowCancelModal(false)}
                />
              </div>

              <div className="modal-body">
                <p className="mb-0">Are you sure you want to cancel this order?</p>
                <small className="text-muted">
                  This action cannot be undone.
                </small>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  No
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    cancelOrder(selectedOrder);
                    setShowCancelModal(false);
                  }}
                >
                  Yes, Cancel Order
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* STEP */
const Step = ({ active, icon, label }) => (
  <motion.div
    className="text-center flex-grow-1 flex-sm-grow-0"
    style={{ minWidth: 70 }}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.5 }}
  >
    <div
      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-1"
      style={{
        width: 40,
        height: 40,
        background: active ? ACTIVE_COLOR : INACTIVE_BG,
        color: active ? "#fff" : INACTIVE_TEXT,
      }}
    >
      {icon}
    </div>
    <small className={active ? "fw-semibold" : "text-muted"}>{label}</small>
  </motion.div>
);

/* LINE */
const Line = ({ active }) => (
  <motion.div
    className="line flex-fill mx-1 mx-sm-2"
    style={{
      height: 2,
      borderRadius: 2,
      background: active ? ACTIVE_COLOR : INACTIVE_BG,
    }}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.5 }}
  />
);

export default Order;