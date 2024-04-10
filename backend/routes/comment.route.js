import express from "express";
import {
  createCommentController,
  getCommentsController,
  likeCommentController,
  editCommentController,
  deleteCommentController,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils.js";
const router = express.Router();

router.post("/createcomment", verifyToken, createCommentController);
router.get("/getcomments/:postId", getCommentsController);
router.put("/likecomment/:commentid", verifyToken, likeCommentController);
router.put("/editcomment/:commentid", verifyToken, editCommentController);
router.delete("/deletecomment/:commentid", verifyToken, deleteCommentController);
export default router;
