import { FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminHeader = ({ onToggle }) => {
  return (
    <motion.header
      className="admin-header"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.button
        className="header-toggle"
        onClick={onToggle}
        whileTap={{ scale: 0.9 }}
      >
        <FiMenu />
      </motion.button>

    </motion.header>
  );
};

export default AdminHeader;
