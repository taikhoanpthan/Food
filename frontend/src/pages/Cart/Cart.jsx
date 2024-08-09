// Trong component Cart
import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const formatPrice = (price) => {
  // Định dạng giá tiền thành chuỗi có dấu chấm và thêm đơn vị VND
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    url,
    addToCart,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // Hàm tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = (itemId) => {
    addToCart(itemId);
  };

  // Hàm giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = (itemId) => {
    if (cartItems[itemId] > 1) {
      removeFromCart(itemId);
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Ảnh SP</p>
          <p>Tên SP</p>
          <p>Đơn giá</p>
          <p>Số lượng</p>
          <p>Tổng</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{formatPrice(item.price)}</p>
                  <div className="quantity-control">
                    <button onClick={() => decreaseQuantity(item._id)}>
                      -
                    </button>
                    <p>{cartItems[item._id]}</p>
                    <button onClick={() => increaseQuantity(item._id)}>
                      +
                    </button>
                  </div>
                  <p>{formatPrice(item.price * cartItems[item._id])}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng giỏ hàng</h2>
          <div className="">
            <div className="cart-total-details">
              <p>Tổng tiền</p>
              <p>{formatPrice(getTotalCartAmount())}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuyển</p>
              <p>{formatPrice(getTotalCartAmount() === 0 ? 0 : 12000)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng</b>
              <b>
                {formatPrice(
                  getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 12000
                )}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            Tiến hành thanh toán
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Nếu bạn có mã giảm giá, hãy nhập vào đây</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Nhập mã..." />
              <button>Nhập</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
