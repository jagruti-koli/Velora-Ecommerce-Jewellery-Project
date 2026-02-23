import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    id: "",
    title: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:3000/products");

        const foundProduct = res.data.find(
          (p) => String(p.id) === String(id)
        );

        if (!foundProduct) {
          setError("Product not found");
        } else {
          setProduct({
            id: foundProduct.id, // 🔥 VERY IMPORTANT
            title: foundProduct.title || "",
            price: foundProduct.price || "",
            category: foundProduct.category || "",
            stock: foundProduct.stock || "",
            image: foundProduct.image || "",
            description: foundProduct.description || "",
          });
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  /* ================= UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.title || !product.price || !product.stock) {
      toast.error("Please fill all required fields ❌");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/products/${product.id}`,
        {
          ...product,              // 🔥 id included
          price: Number(product.price),
          stock: Number(product.stock),
        }
      );

      toast.success("Product updated successfully ✨");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1200);
    } catch (err) {
      toast.error("Update failed ❌");
    }
  };

  /* ================= UI STATES ================= */
  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (error) {
    return (
      <div className="text-center mt-5">
        <h5 className="text-danger">{error}</h5>
        <button
          className="btn btn-outline-dark mt-3"
          onClick={() => navigate("/admin/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={2000} />

      <h3 className="mb-4">Edit Product</h3>

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow-sm border-0">
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
                        required
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
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Price (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={product.price}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Stock</label>
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
                      <label className="form-label">Category</label>
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
                        <option value="Men - Rings">Men - Rings</option>
                        <option value="Men - Chains">Men - Chains</option>
                        <option value="Gold Jewellery">Gold Jewellery</option>
                        <option value="Silver Jewellery">Silver Jewellery</option>
                      </select>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="col-md-5">
                    <div className="image-preview-card text-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt="preview"
                          className="img-fluid rounded"
                        />
                      ) : (
                        <div className="placeholder">Image Preview</div>
                      )}
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>

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
                  >
                    Update Product
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
