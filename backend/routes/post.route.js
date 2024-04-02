import express from "express";
import { verifyToken } from "../utils.js";
import { createController } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create", verifyToken, createController);

export default router;
