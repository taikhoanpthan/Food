import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://taikhoanpthan123:AnhMy_123@cluster0.48khl7w.mongodb.net/food-jobs"
    )
    .then(() => console.log("DB connected"));
};
