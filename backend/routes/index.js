import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import postRoutes from "./post.route.js";
import commentRoutes from "./comment.route.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/comment", commentRoutes);

export default router;
