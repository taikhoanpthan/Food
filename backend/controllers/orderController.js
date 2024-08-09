import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173"; // Sử dụng biến môi trường cho URL frontend
    const { items, amount, address } = req.body;
    const userId = req.userId; // Lấy userId từ middleware xác thực

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    // Xóa dữ liệu giỏ hàng sau khi đặt hàng
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Chuẩn bị các mặt hàng cho session Stripe Checkout
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr", // Thay đổi theo tiền tệ bạn sử dụng, ví dụ: "usd"
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Giá tính bằng cents
      },
      quantity: item.quantity,
    }));

    // Thêm phí giao hàng vào danh sách mặt hàng
    line_items.push({
      price_data: {
        currency: "inr", // Thay đổi theo tiền tệ bạn sử dụng, ví dụ: "usd"
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 12000, // Phí giao hàng tính bằng cents
      },
      quantity: 1,
    });

    // Tạo session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Trả về URL của session để redirect đến Stripe Checkout
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// Lấy đơn hàng của người dùng cho frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId; // Lấy userId từ middleware xác thực
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error getting orders" });
  }
};

// Liệt kê đơn hàng cho admin
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo, mới nhất trước
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error getting orders" });
  }
};

// API cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating order status" });
  }
};

export { placeOrder, userOrders, listOrders, updateOrderStatus };
