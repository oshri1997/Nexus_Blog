import express from "express";
import { verifyToken } from "../utils.js";
import { createController, getPostsController } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createController);
router.get("/getposts", getPostsController);

export default router;
