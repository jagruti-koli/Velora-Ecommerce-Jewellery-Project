import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { Navigation, Mousewheel, Scrollbar } from "swiper/modules";

import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

const Cart = () => {
  const { cart, removeFromCart, updateQty, isInCart } = useCart();
  const { products } = useProducts();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /* ✅ EMPTY STATE LOGIC */
  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page container py-4">
        <h2 className="cart-title">Shopping Cart</h2>

        <div className="cart-empty-content">
          <img
            src="/empty-cart.png"
            alt="Empty Cart"
            className="empty-cart-img"
          />

          <p className="empty-text">Your cart is empty.</p>

          <p className="empty-subtext">
            Let's fill it up with some amazing jewellery!
          </p>

          <button
            className="explore-btn"
            onClick={() => navigate("/")}
          >
            Explore Now →
          </button>
        </div>
      </div>
    );
  }
  /* ✅ EMPTY STATE ENDS */

  const cartIds = cart.map((item) => item.id);

  const similarProducts =
    products?.filter((p) => !cartIds.includes(p.id)) || [];

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  /* ✅ CHECKOUT BUTTON LOGIC (ADDED) */
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/checkout" },
      });
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="cart-page container py-4">
      <div className="row">
        {/* LEFT SIDE */}
        <div className={`col-lg-8 ${cart.length > 0 ? "cart-transition" : ""}`}>
          {cart.map((item) => (
            <div key={item.id} className="cart-item-wrapper">
              <img src={item.image} alt={item.name} />

              <div className="flex-grow-1">
                <h5>{item.name}</h5>
                <p className="fw-bold">₹{item.price}</p>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateQty(item.id, Math.max(1, item.qty - 1))
                    }
                  >
                    −
                  </button>

                  <span>{item.qty}</span>

                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateQty(item.id, item.qty + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* ✅ SIMILAR PRODUCTS */}
          {similarProducts.length > 0 && (
            <>
              <h5 className="mt-4 mb-3">You may also like</h5>

              <Swiper
                modules={[Navigation, Mousewheel, Scrollbar]}
                navigation
                scrollbar={{ draggable: true }}
                slidesPerView={"auto"}
                spaceBetween={18}
                grabCursor={true}
                mousewheel={{
                  forceToAxis: true,
                  sensitivity: 0.4,
                  thresholdDelta: 20,
                  releaseOnEdges: true,
                }}
                touchRatio={1.2}
                simulateTouch={true}
                resistanceRatio={0.85}
                speed={650}
              >
                {similarProducts.map((product) => (
                  <SwiperSlide
                    key={`${product.id}-similar`}
                    style={{ width: "210px" }}
                  >
                    <ProductCard
                      product={product}
                      disableAdd={isInCart(product.id)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          )}
        </div>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <div className="col-lg-4">
          <div className="order-summary position-sticky">
            <h4>Order Summary</h4>

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              className="checkout-btn mt-3 w-100"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
