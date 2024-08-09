import React, { useContext, useEffect, useState } from "react";
import "./index.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const Myorders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    if (!token) {
      console.error("No token found. User is not authenticated.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang vận chuyển":
        return "status-shipping";
      case "Hủy":
        return "status-cancelled";
      default:
        return "status-processing";
    }
  };

  return (
    <div className="my-orders">
      <h2>Đơn hàng của tôi</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />
            <p>
              {order.items.map((item, index) =>
                index === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>
            <p>Tổng giá tiền: {order.amount} VNĐ</p>
            <p>Số lượng: {order.items.length}</p>
            <p>
              <span
                className={`order-status-dot ${getStatusClass(order.status)}`}
              >
                &#x25cf;
              </span>
              <b>{order.status}</b>
            </p>
            <button onClick={fetchOrders}>Kiểm tra</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Myorders;
