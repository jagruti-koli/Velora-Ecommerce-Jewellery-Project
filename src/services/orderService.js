// src/services/orderService.js

export const getAllOrders = async () => {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  return JSON.parse(JSON.stringify(orders)); // 🔥 deep clone
};

export const updateOrderById = async (orderId, updatedOrder) => {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const updatedOrders = orders.map(order =>
    String(order.id) === String(orderId)
      ? updatedOrder
      : order
  );

  localStorage.setItem("orders", JSON.stringify(updatedOrders));
  return true;
};
