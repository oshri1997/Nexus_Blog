import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB, errorHandler } from "./utils.js";
import routes from "./routes/index.js";
import cors from "cors";
import path from "path";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectDB();
const port = process.env.PORT || 3000;

app.use("/api", routes);
app.use(errorHandler);
const __dirname = path.resolve();
const parentDir = path.dirname(__dirname);
app.use(express.static(path.join(parentDir, "/frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(parentDir, "/frontend/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
