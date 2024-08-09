import { useState, useEffect } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = () => {
  const url = "http://localhost:4000"; // Ensure this URL is correct
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log("Fetch List Response:", response); // Log response for debugging
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Error fetching list");
      console.error("There was an error!", error);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      console.log("Remove Food Response:", response); // Log response for debugging
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Fetch the list again after a successful removal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error removing food item");
      console.error("There was an error!", error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-container">
      <h2>Tất cả sản phẩm</h2>
      <div className="list-table">
        <div className="list-table-header">
          <span>Ảnh</span>
          <span>Tên</span>
          <span>Danh mục</span>
          <span>Giá</span>
          <span>Xóa</span>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-row">
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}đ</p>
            <button onClick={() => removeFood(item._id)} className="remove-button">
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
