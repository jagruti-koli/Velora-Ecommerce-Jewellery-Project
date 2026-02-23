import React, {
  createContext,
  useState,
  useEffect,
  useContext   // ✅ ADD
} from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from JSON server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // CRUD operations
  const addProduct = async (product) => {
    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      await fetch(`http://localhost:3000/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      setProducts(
        products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

/* ✅ YE NAYA ADD */
export const useProducts = () => {
  return useContext(ProductContext);
};
