import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={assets.logo} alt="Logo" />
      </div>
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option" activeClassName="active">
          <img src={assets.add_icon} alt="Add Product" />
          <span>Thêm sản phẩm</span>
        </NavLink>
        <NavLink to="/list" className="sidebar-option" activeClassName="active">
          <img src={assets.add_icon} alt="Product List" />
          <span>Danh sách sản phẩm</span>
        </NavLink>
        <NavLink to="/order" className="sidebar-option" activeClassName="active">
          <img src={assets.order_icon} alt="Orders" />
          <span>Đơn hàng đang có</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
