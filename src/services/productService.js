const API_URL = "http://localhost:3000/products";

export const getAllProducts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export const getProductById = async (id) => {
    const response = await fetch(`http://localhost:3000/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return response.json();
  };
  