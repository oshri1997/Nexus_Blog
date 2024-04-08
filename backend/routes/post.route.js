import express from "express";
import { verifyToken } from "../utils.js";
import {
  createController,
  getPostsController,
  deletePostController,
  updatePostController,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createController);
router.get("/getposts", getPostsController);
router.delete("/deletepost/:postid/:userid", verifyToken, deletePostController);
router.put("/updatepost/:postid/:userid", verifyToken, updatePostController);
export default router;
