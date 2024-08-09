import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Add.css";
import { assets } from "../../assets/assets";

const Add = () => {
  const url = "https://food-te0g.onrender.com";
  const [image, setImage] = useState(null);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Milk Tea",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Submit Response:", response);

      if (response.data && response.data.success) {
        clearForm();
        toast.success(response.data.message);
      } else {
        toast.error(
          response.data ? response.data.message : "Unknown error occurred"
        );
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error("There was an error!", error);
    }
  };

  const clearForm = () => {
    setData({
      name: "",
      description: "",
      price: "",
      category: "Milk Tea",
    });
    setImage(null);
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setImage(file);
    } else {
      toast.error("Invalid image format. Please upload a JPG or PNG file.");
    }
  };

  return (
    <div className="add">
      <form className="form" onSubmit={onSubmitHandler}>
        <div className="form-group">
          <p>Upload Product Image</p>
          <label htmlFor="image" className="image-label">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload Preview"
            />
          </label>
          <input
            onChange={onImageChange}
            type="file"
            id="image"
            hidden
            required
          />
        </div>
        <div className="form-group">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>
        <div className="form-group">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          ></textarea>
        </div>
        <div className="form-group-inline">
          <div className="form-group">
            <p>Category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
            >
              <option value="Milk Tea">Milk Tea</option>
              <option value="Fruits Tea">Fruits Tea</option>
              <option value="Coffee">Coffee</option>
              <option value="IceEgg">IceEgg</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="form-group">
            <p>Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="10.000Đ"
              required
            />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
