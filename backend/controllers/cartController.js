import userModel from "../models/userModel.js";

// Thêm mặt hàng vào giỏ hàng của người dùng
const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // Lấy userId từ req.userId (đã được thiết lập trong middleware xác thực)
    const { itemId } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found!" });
    }

    // Lấy dữ liệu giỏ hàng của người dùng
    let cartData = userData.cartData || {};

    // Thêm hoặc cập nhật số lượng mặt hàng trong giỏ hàng
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    // Cập nhật giỏ hàng trong cơ sở dữ liệu
    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding item to cart" });
  }
};

// Xóa mặt hàng khỏi giỏ hàng của người dùng
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId; // Lấy userId từ req.userId (đã được thiết lập trong middleware xác thực)
    const { itemId } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found!" });
    }

    // Lấy dữ liệu giỏ hàng của người dùng
    let cartData = userData.cartData || {};

    // Xóa mặt hàng khỏi giỏ hàng nếu có
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId]; // Xóa mặt hàng khỏi giỏ hàng nếu số lượng bằng 0
      }
    }

    // Cập nhật giỏ hàng trong cơ sở dữ liệu
    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing item from cart" });
  }
};

// Lấy dữ liệu giỏ hàng của người dùng
const getCart = async (req, res) => {
  try {
    const userId = req.userId; // Lấy userId từ req.userId (đã được thiết lập trong middleware xác thực)

    // Tìm người dùng trong cơ sở dữ liệu
    let userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found!" });
    }

    // Lấy dữ liệu giỏ hàng của người dùng
    let cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching cart data" });
  }
};

export { addToCart, removeFromCart, getCart };
