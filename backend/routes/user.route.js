import express from "express";
import { updateUserController, deleteUserController } from "../controllers/user.controller.js";
import { verifyToken } from "../utils.js";

const router = express.Router();
router.put("/update/:userid", verifyToken, updateUserController);
router.delete("/delete/:userid", verifyToken, deleteUserController);

export default router;
