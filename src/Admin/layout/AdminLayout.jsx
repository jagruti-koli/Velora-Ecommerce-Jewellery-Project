import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminHeader from "../components/AdminHeader";
import { motion } from "framer-motion";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className={`admin-wrapper ${collapsed ? "collapsed" : ""}`}>
      <AdminNavbar collapsed={collapsed} onLogout={handleLogout} />
      <AdminHeader onToggle={() => setCollapsed(!collapsed)} />

      {/* Page animation */}
      <motion.main
        className="admin-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default AdminLayout;
