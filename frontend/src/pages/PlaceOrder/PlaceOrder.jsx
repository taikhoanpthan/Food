import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const PlaceOrder = () => {
  const MySwal = withReactContent(Swal);
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  const placeOrder = async (event) => {
    event.preventDefault();
    MySwal.fire({
      title: "Đang xử lý đơn hàng...",
      didOpen: () => {
        MySwal.showLoading();
      },
    });

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 12000, // Adjusted for your shipping fee
    };

    try {
      let res = await axios.post(url + "api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` }, // Đảm bảo token được gửi đúng cách
      });
      if (res.data.success) {
        const { session_url } = res.data;
        console.log("Redirecting to:", session_url);
        window.location.replace(session_url);
      } else {
        MySwal.fire({
          icon: "error",
          title: "Đặt hàng thất bại",
          text: "Có lỗi xảy ra khi đặt hàng, vui lòng thử lại sau.",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      MySwal.fire({
        icon: "success",
        title: "Thanh toán thành công",
        text: "Vui lòng kiểm tra đơn hàng của bạn.",
      }).then(() => {
        navigate("/myorders");
      });
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Thông tin giao hàng</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="Họ đệm"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Tên"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Địa chỉ Email"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Số nhà"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="Đường"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="Quận"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Thành Phố"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Số điện thoại"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Tổng hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tổng tiền</p>
              <p>{getTotalCartAmount()} VND</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Phí vận chuyển</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 12000} VND</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Tổng</b>
              <b>
                {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 12000}
                VND
              </b>
            </div>
          </div>
          <button type="submit">THANH TOÁN</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
