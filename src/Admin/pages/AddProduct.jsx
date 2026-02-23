import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddProduct = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.title ||
      !product.price ||
      !product.category ||
      !product.stock ||
      !product.image
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:3000/products", {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        createdAt: new Date(),
      });

      navigate("/admin/products");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container-fluid add-product-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="mb-4">Add New Product</h3>

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <motion.div
            className="card shadow-sm border-0 add-product-card"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* LEFT */}
                  <div className="col-md-7">
                    <div className="mb-3">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={product.title}
                        onChange={handleChange}
                        placeholder="Gold Ring for Women"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Premium quality jewellery..."
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Price (₹) *</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={product.price}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Stock *</label>
                        <input
                          type="number"
                          className="form-control"
                          name="stock"
                          value={product.stock}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                      >
                        <option value="">Select category</option>

                        <option value="Women - Rings">Women - Rings</option>
                        <option value="Women - Earrings">Women - Earrings</option>
                        <option value="Women - Necklaces">Women - Necklaces</option>
                        <option value="Women - Bracelets">Women - Bracelets</option>
                        <option value="Women - Anklets">Women - Anklets</option>

                        <option value="Men - Rings">Men - Rings</option>
                        <option value="Men - Chains">Men - Chains</option>
                        <option value="Men - Bracelets">Men - Bracelets</option>
                        <option value="Men - Earrings">Men - Earrings</option>

                        <option value="Gold Jewellery">Gold Jewellery</option>
                        <option value="Silver Jewellery">Silver Jewellery</option>
                      </select>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="col-md-5">
                    <motion.div
                      className="image-preview-card text-center"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt="preview"
                          className="img-fluid rounded"
                        />
                      ) : (
                        <div className="placeholder">Image Preview</div>
                      )}
                    </motion.div>

                    <div className="mt-3">
                      <label className="form-label">Image URL *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="image"
                        value={product.image}
                        onChange={handleChange}
                        placeholder="https://image-url"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}

                <div className="d-flex justify-content-end gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/admin/products")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn text-white px-4"
                    style={{ backgroundColor: "#e85c7a" }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddProduct;
