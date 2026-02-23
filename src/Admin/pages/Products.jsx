import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    /* ================= FETCH ================= */
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:3000/products");
            setProducts(res.data || []);
        } catch {
            toast.error("Failed to load products");
        }
    };

    /* ================= DELETE ================= */
    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const confirmDelete = async () => {
        if (!selectedProduct) return;

        const id = selectedProduct.id || selectedProduct._id;

        try {
            const res = await axios.delete(
                `http://localhost:3000/products/${id}`
            );

            if (res.status === 200 || res.status === 204) {
                setProducts((prev) => prev.filter((p) => p.id !== id));
                toast.success("Product deleted successfully 🗑️");
                closeModal();
            }
        } catch (err) {
            console.error(err);
            toast.error("Product delete failed ❌");
        }
    };

    /* ================= SEARCH ================= */
    const filteredProducts = products.filter((item) =>
        (item.title || "").toLowerCase().includes(search.toLowerCase())
    );

    /* ================= ANIMATIONS ================= */
    const rowAnim = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    return (
        <div className="products-wrapper bg-white rounded-4 shadow-sm p-3 p-md-4">

            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h4 className="fw-bold mb-1">Products</h4>
                    <p className="text-muted mb-0">Manage all jewellery items</p>
                </div>

                {/* ADD BUTTON – DESKTOP */}
                <Link
                    to="/admin/add-product"
                    className="btn add-btn d-none d-md-flex align-items-center gap-2"
                >
                    <FaPlus /> Add Product
                </Link>
            </div>

            {/* SEARCH */}
            <input
                type="text"
                className="form-control form-control-lg mb-4"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* TABLE – DESKTOP */}
            <div className="table-responsive d-none d-md-block">
                <table className="table align-middle table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        <AnimatePresence>
                            {filteredProducts.length ? (
                                filteredProducts.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        variants={rowAnim}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        transition={{ duration: 0.25 }}
                                    >
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    className="product-img"
                                                    alt={item.title}
                                                />
                                                <div>
                                                    <div className="fw-semibold">{item.title}</div>
                                                    <small className="text-muted">#{item.id}</small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{item.category}</td>
                                        <td>₹{item.price}</td>

                                        <td>
                                            {item.stock <= 5 ? (
                                                <span className="badge bg-danger">
                                                    Low ({item.stock})
                                                </span>
                                            ) : (
                                                <span className="badge bg-success">
                                                    In Stock ({item.stock})
                                                </span>
                                            )}
                                        </td>

                                        <td className="text-end">
                                            <Link
                                                to={`/admin/edit-product/${item.id}`}
                                                className="icon-btn edit"
                                            >
                                                <FaEdit />
                                            </Link>

                                            <button
                                                className="icon-btn delete"
                                                onClick={() => openDeleteModal(item)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="d-md-none">
                <AnimatePresence>
                    {filteredProducts.map((item) => (
                        <motion.div
                            key={item.id}
                            className="card mb-3 p-3 shadow-sm rounded-3"
                            variants={rowAnim}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className="d-flex gap-3">
                                <img src={item.image} className="product-img" alt="" />
                                <div className="flex-grow-1">
                                    <div className="fw-semibold">{item.title}</div>
                                    <small className="text-muted">#{item.id}</small>
                                    <div className="mt-1">₹{item.price}</div>
                                    <div className="mt-1">
                                        {item.stock <= 5 ? (
                                            <span className="badge bg-danger">
                                                Low ({item.stock})
                                            </span>
                                        ) : (
                                            <span className="badge bg-success">
                                                In Stock ({item.stock})
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="d-flex flex-column gap-2">
                                    <Link
                                        to={`/admin/edit-product/${item.id}`}
                                        className="icon-btn edit"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="icon-btn delete"
                                        onClick={() => openDeleteModal(item)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* FLOATING ADD – MOBILE */}
            <motion.div
                className="d-md-none position-fixed"
                style={{ bottom: 20, right: 20, zIndex: 9999 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
            >
                <Link
                    to="/admin/add-product"
                    className="btn add-btn rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 56, height: 56 }}
                >
                    <FaPlus />
                </Link>
            </motion.div>

            {/* DELETE MODAL */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="delete-modal"
                            drag="y"
                            dragConstraints={{ top: 0 }}
                            dragElastic={0.25}
                            onDragEnd={(event, info) => {
                                if (info.offset.y > 120) {
                                    closeModal(); // 👈 swipe-down close
                                }
                            }}
                            initial={{ y: "100%", scale: 0.96 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: "100%", scale: 0.96 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 22,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* DRAG HANDLE */}
                            <div className="modal-handle"></div>

                            {/* WARNING ICON */}
                            <div className="warning-icon pulse">⚠️</div>

                            <h5 className="fw-bold text-center mb-2">
                                Delete Product
                            </h5>

                            <p className="text-center text-muted mb-1">
                                Are you sure you want to delete
                            </p>

                            <p className="text-center fw-semibold mb-2">
                                {selectedProduct?.title}
                            </p>

                            <p className="text-center text-danger small mb-4">
                                This action cannot be undone.
                            </p>

                            {/* ACTIONS */}
                            <div className="modal-actions">
                                <button
                                    className="btn btn-light w-100"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-danger w-100"
                                    onClick={confirmDelete}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Products;
