import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB, errorHandler } from "./utils.js";
import routes from "./routes/index.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectDB();
const port = process.env.PORT || 3000;

app.use("/api", routes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
