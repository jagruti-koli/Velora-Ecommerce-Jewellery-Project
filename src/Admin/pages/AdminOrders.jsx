import React, { useEffect, useState, useRef } from "react";
import { getAllOrders, updateOrderById } from "../../services/orderService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const STATUS_OPTIONS = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

const STATUS_ICONS = {
  Placed: "🛒",
  Shipped: "🚚",
  "Out for Delivery": "📦",
  Delivered: "✔️",
};

const CANCEL_REASONS = [
  "Customer changed mind",
  "Payment issue",
  "Out of stock",
  "Incorrect address",
  "Delivery delay",
  "Other",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNote, setCancelNote] = useState("");

  const startY = useRef(0);

  useEffect(() => {
    getAllOrders().then((res) => setOrders(Array.isArray(res) ? res : []));
  }, []);

  const updateStatus = async (order, status) => {
    if (order.status === "Cancelled" || order.status === "Delivered") return;

    const updated = {
      ...order,
      status,
      timeline: [...(order.timeline || []), { status, date: new Date() }],
    };

    await updateOrderById(order.id, updated);
    setOrders((p) => p.map((o) => (o.id === order.id ? updated : o)));
    toast.success(`Status updated to ${status}`);
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setCancelNote("");
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!cancelReason) return toast.warning("Select cancel reason");

    if (cancelReason === "Other" && !cancelNote.trim()) {
      return toast.warning("Enter cancel note");
    }

    const updated = {
      ...selectedOrder,
      status: "Cancelled",
      cancelReason,
      cancelNote,
      cancelledAt: new Date(),
    };

    await updateOrderById(selectedOrder.id, updated);
    setOrders((p) =>
      p.map((o) => (o.id === selectedOrder.id ? updated : o))
    );

    toast.error("Order Cancelled");
    setShowCancelModal(false);
  };

  /* swipe-down close */
  const onTouchStart = (e) => (startY.current = e.touches[0].clientY);
  const onTouchMove = (e) => {
    if (e.touches[0].clientY - startY.current > 120) {
      setShowCancelModal(false);
    }
  };

  return (
    <div className="admin-orders-wrapper">
      <ToastContainer />
      <h3 className="admin-title">Admin Orders</h3>

      {orders.map((order) => {
        const currentIndex = STATUS_OPTIONS.indexOf(order.status);

        return (
          <motion.div
            key={order.id}
            className="order-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* HEADER */}
            <div className="order-header">
              <div>
                <strong>Order #{order.id}</strong>
                <div className="order-date">
                  {new Date(order.createdAt).toDateString()}
                </div>
              </div>

              <div>
                <span className="order-total">₹{order.total}</span>

                {order.status !== "Delivered" &&
                  order.status !== "Cancelled" && (
                    <button
                      className="cancel-btn"
                      onClick={() => openCancelModal(order)}
                    >
                      Cancel Order
                    </button>
                  )}

                {order.status === "Cancelled" && (
                  <span className="cancelled-badge">
                    Cancelled — {order.cancelReason}
                  </span>
                )}
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="customer-details">
              <p><b>Name:</b> {order.userName}</p>
              <p><b>Email:</b> {order.email}</p>
              <p><b>Payment:</b> {order.payment}</p>
              <p>
                <b>Address:</b> {order.address?.street},{" "}
                {order.address?.city},{" "}
                {order.address?.state} - {order.address?.zip}
              </p>
            </div>

            {/* DESKTOP TIMELINE (UNCHANGED STRUCTURE) */}
            {order.status !== "Cancelled" && (
              <div className="timeline-container desktop-only">
                {STATUS_OPTIONS.map((st, i) => (
                  <React.Fragment key={st}>
                    <div
                      className={`timeline-node ${
                        i <= currentIndex ? "active" : ""
                      }`}
                      onClick={() => updateStatus(order, st)}
                    >
                      <div className="node-circle">{STATUS_ICONS[st]}</div>
                      <span>{st}</span>
                    </div>

                    {i < STATUS_OPTIONS.length - 1 && (
                      <div
                        className={`timeline-connector ${
                          i < currentIndex ? "active" : ""
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* MOBILE STATUS ICONS (ONLY ICONS) */}
            {order.status !== "Cancelled" && (
              <div className="mobile-status-row mobile-only">
                {STATUS_OPTIONS.map((st, i) => (
                  <div
                    key={st}
                    className={`mobile-status-icon ${
                      i <= currentIndex ? "active" : ""
                    }`}
                    onClick={() => updateStatus(order, st)}
                  >
                    {STATUS_ICONS[st]}
                  </div>
                ))}
              </div>
            )}

            {/* ITEMS (RESTORED) */}
            <div className="items-inline">
              {(order.items || []).map((item) => (
                <div key={item.id} className="item-inline">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>Qty: {item.qty}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* CANCEL MODAL (SAME STRUCTURE) */}
      {showCancelModal && (
        <div className="modal-overlay">
          <motion.div
            className="confirm-modal"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
          >
            <div className="modal-drag" />
            <h4>Cancel Order?</h4>

            <select className="cancel-reason-select"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option value="">Select cancel reason</option>
              {CANCEL_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            {cancelReason === "Other" && (
              <textarea
                placeholder="Enter cancel note..."
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
              />
            )}

            <div className="modal-actions">
              <button onClick={() => setShowCancelModal(false)}>
                Keep Order
              </button>
              <button className="danger" onClick={confirmCancel}>
                Confirm Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
