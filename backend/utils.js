import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    if (connect.connection.readyState === 1) console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export const hashedPassword = async (password) => {
  const salt = bcryptjs.genSaltSync(10);
  return await bcryptjs.hash(password, salt);
};
