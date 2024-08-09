import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  // Kiểm tra xem category và setCategory đã được truyền vào hay không
  if (!category || !setCategory) {
    return null; // hoặc bạn có thể trả về một phần tử JSX mặc định khác
  }

  return (
    <div className="exploreMenu">
      <div className="explore-menu" id="explore-menu">
        <h1>Khám phá thực đơn của chúng tôi</h1>
        <p className="explore-menu-text">
          "Teapresso" | Máy pha trà sữa – Tươi hơn, Đậm hơn, Ít ngọt. Điều gì sẽ
          xảy ra nếu một tách trà đậm đà, thơm tho cũng có Dalgona ở trên, x2
          hương vị bùng nổ Mời bạn thưởng thức một món ăn mới cùng một số nha sĩ
        </p>
        <div className="explore-menu-list">
          {menu_list.map((item, index) => (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className={`explore-menu-list-item ${
                category === item.menu_name ? "active" : ""
              }`}
            >
              <img
                src={item.menu_image}
                alt=""
                className={`explore-menu-item-image ${
                  category === item.menu_name ? "active" : ""
                }`}
              />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
        <hr />
      </div>
    </div>
  );
};

export default ExploreMenu;
