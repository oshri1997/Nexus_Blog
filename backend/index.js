import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils.js";
import authRoutes from "./routes/auth.route.js";
dotenv.config();

const app = express();
app.use(express.json());
connectDB();
const port = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
