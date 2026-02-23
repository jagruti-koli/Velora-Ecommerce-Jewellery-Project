import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { BsGem } from "react-icons/bs";

const menuVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

const AdminNavbar = ({ collapsed, onLogout }) => {
  return (
    <motion.aside
      className={`admin-sidebar ${collapsed ? "mini" : ""}`}
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="sidebar-logo">
        <BsGem className="logo-icon" />
      </div>
       
      <motion.nav
        className="sidebar-menu"
        variants={menuVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <NavLink to="/admin/dashboard">
            <FiHome />
            <span>Dashboard</span>
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavLink to="/admin/products">
            <FiBox />
            <span>Products</span>
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavLink to="/admin/orders">
            <FiShoppingCart />
            <span>Orders</span>
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavLink to="/admin/users">
            <FiUsers />
            <span>Users</span>
          </NavLink>
        </motion.div>

        <motion.button
          variants={itemVariants}
          className="sidebar-logout"
          onClick={onLogout}
          whileTap={{ scale: 0.95 }}
        >
          <FiLogOut />
          <span>Logout</span>
        </motion.button>
      </motion.nav>
    </motion.aside>
  );
};

export default AdminNavbar;
