import { useEffect, useState } from "react";
import "./Order.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";
import moment from "moment";

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token không tồn tại. Vui lòng đăng nhập lại.");
        return;
      }

      const response = await axios.get("https://food-te0g.onrender.com/api/order/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.data);
        if (response.data.data.length === 0) {
          toast.info("No orders found.");
        }
      } else {
        toast.error("Error fetching orders: " + response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching orders");
      console.error("Error fetching orders:", error.response ? error.response.data : error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token không tồn tại. Vui lòng đăng nhập lại.");
        return;
      }

      const response = await axios.post("https://food-te0g.onrender.com/api/order/status", {
        orderId,
        status: event.target.value,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error("Error updating order status: " + response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating order status");
      console.error("Error updating order status:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []); // Chạy một lần khi component mount

  return (
    <div className="order add">
      <h3>Trang quản lý đơn hàng</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, i) => (
                    <span key={i}>
                      {item.name} x {item.quantity}
                      {i < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <p className="order-item-name">
                  <span>Họ và Tên: </span>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>
                    <span style={{ fontWeight: "bold" }}>Số nhà: </span>
                    {order.address.street},
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Đường: </span>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">
                  <span style={{ fontWeight: "bold" }}>Số điện thoại: </span>
                  {order.address.phone}
                </p>
              </div>
              <p>Số lượng: {order.items.length}</p>
              <p>
                <span style={{ fontWeight: "bold" }}>Tổng tiền: </span>
                {order.amount} VNĐ
              </p>
              <p className="order-item-date">
                Ngày tạo: {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
              </p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Đơn hàng đang xử lý">Đơn hàng đang xử lý</option>
                <option value="Đang vận chuyển">Đang vận chuyển</option>
                <option value="Hủy">Hủy</option>
              </select>
            </div>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Order;
