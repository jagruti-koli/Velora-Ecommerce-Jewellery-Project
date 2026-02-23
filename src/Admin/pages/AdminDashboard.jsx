import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Built-in animated number component
const AnimatedNumber = ({ value, prefix = "" }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) return;

    const duration = 1500; // ms
    const increment = end / (duration / 30);

    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      setDisplay(Math.floor(start));
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return <>{prefix}{display.toLocaleString()}</>;
};

// Card component with spring animation
const Card = ({ title, children }) => (
  <div className="col-md-6 col-lg-3">
    <motion.div
      className="card shadow-sm p-3 p-md-4 text-center dashboard-card"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <h6 className="text-muted">{title}</h6>
      <motion.div
        className="fw-bold"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {children}
      </motion.div>
    </motion.div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3000/products"),
          axios.get("http://localhost:3000/orders"),
          axios.get("http://localhost:3000/users"),
        ]);

        const totalRevenue = ordersRes.data.reduce(
          (sum, order) => sum + (Number(order.total) || 0),
          0
        );

        setStats({
          products: Array.isArray(productsRes.data) ? productsRes.data.length : 0,
          orders: Array.isArray(ordersRes.data) ? ordersRes.data.length : 0,
          users: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
          revenue: totalRevenue,
        });

        const recent = Array.isArray(ordersRes.data) ? ordersRes.data.slice(-5).reverse() : [];
        setRecentOrders(recent);

        const lowStock = Array.isArray(productsRes.data)
          ? productsRes.data.filter((p) => Number(p.stock) <= 5)
          : [];
        setLowStockProducts(lowStock);

        const productSales = {};
        ordersRes.data.forEach((order) => {
          Array.isArray(order.items) &&
            order.items.forEach((item) => {
              const name = String(item.name || "Unknown");
              const qty = Number(item.quantity) || 0;
              productSales[name] = (productSales[name] || 0) + qty;
            });
        });
        const sortedTopProducts = Object.entries(productSales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        setTopProducts(sortedTopProducts);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []);

  const statusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "placed":
        return "bg-info text-dark";
      case "shipped":
        return "bg-primary text-white";
      case "out for delivery":
        return "bg-warning text-dark";
      case "delivered":
        return "bg-success text-white";
      case "cancelled":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <motion.div
      className="container-fluid p-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="mb-4 text-center text-md-start">
        <motion.h2
          className="fw-bold dashboard-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome Admin 👋
        </motion.h2>
        <p className="text-muted">{new Date().toLocaleDateString()}</p>
      </div>

      {/* Dashboard Cards */}
      <div className="row g-4 mb-5">
        <Card title="Total Revenue">
          <AnimatedNumber value={stats.revenue} prefix="₹" />
        </Card>
        <Card title="Products">{stats.products}</Card>
        <Card title="Orders">{stats.orders}</Card>
        <Card title="Users">{stats.users}</Card>
      </div>

      <div className="row g-4 mb-5">
        {/* Recent Orders */}
        <div className="col-lg-8 col-md-12">
          <motion.div
            className="card shadow-sm p-3 p-md-4 dashboard-card overflow-auto"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h5 className="fw-semibold mb-3">Recent Orders</h5>
            <div className="table-responsive recent-orders-table">
              <table className="table align-middle table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No orders yet
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <td>#{String(order.id)}</td>
                          <td>
                            <div>{String(order.userName) || "Guest"}</div>
                            <small className="text-muted">{String(order.email) || "-"}</small>
                          </td>
                          <td>₹{Number(order.total) || 0}</td>
                          <td>
                            <span className={`badge ${statusColor(order.status)}`}>
                              {String(order.status) || "Pending"}
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Top Products */}
        <div className="col-lg-4 col-md-12">
          <motion.div
            className="card shadow-sm p-3 p-md-4 dashboard-card"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h5 className="fw-semibold mb-3" style={{ color: "#e85c7a" }}>
              🔥 Top Selling Products
            </h5>
            {topProducts.length === 0 ? (
              <p className="text-muted">No sales data yet</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {topProducts.map(([name, qty], index) => {
                  const maxQty = Math.max(...topProducts.map(([_, q]) => q));
                  const barWidth = (qty / maxQty) * 100;

                  return (
                    <motion.li
                      key={index}
                      className="d-flex flex-column mb-3 top-product-item"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="d-flex justify-content-between mb-1">
                        <span>{name}</span>
                        <span className="fw-bold">{qty} sold</span>
                      </div>
                      <div className="top-product-bar-container">
                        <motion.div
                          className="top-product-bar animated-bar"
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        </div>
      </div>

      {/* Low Stock */}
      <motion.div
        className="card shadow-sm p-3 p-md-4 dashboard-card mb-5"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h5 className="fw-semibold mb-3" style={{ color: "#e85c7a" }}>
          ⚠ Low Stock Products
        </h5>
        {lowStockProducts.length === 0 ? (
          <p className="text-muted mb-0">All products are sufficiently stocked 👍</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {lowStockProducts.map((item) => (
              <motion.li
                key={item.id}
                className="d-flex justify-content-between border-bottom py-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span>{item.name}</span>
                <span className="text-danger fw-semibold">{item.stock} left</span>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
