import express from "express";
import {
  createCommentController,
  getCommentsPublicController,
  likeCommentController,
  editCommentController,
  deleteCommentController,
  getCommentsAdminController,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils.js";
const router = express.Router();

router.post("/createcomment", verifyToken, createCommentController);
router.get("/getcomments/:postId", getCommentsPublicController);
router.get("/getcomments", verifyToken, getCommentsAdminController);
router.put("/likecomment/:commentid", verifyToken, likeCommentController);
router.put("/editcomment/:commentid", verifyToken, editCommentController);
router.delete("/deletecomment/:commentid", verifyToken, deleteCommentController);
export default router;
