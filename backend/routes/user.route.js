import express from "express";
import { updateUserController } from "../controllers/user.controller.js";
import { verifyToken } from "../utils.js";

const router = express.Router();
router.put("/update/:userid", verifyToken, updateUserController);
export default router;
