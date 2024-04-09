import express from "express";
import {
  updateUserController,
  deleteUserController,
  getUserController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils.js";

const router = express.Router();
router.put("/update/:userid", verifyToken, updateUserController);
router.delete("/delete/:userid", verifyToken, deleteUserController);
router.get("/getusers", verifyToken, getUserController);

export default router;
