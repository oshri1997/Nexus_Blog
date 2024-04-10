import express from "express";
import {
  updateUserController,
  deleteUserController,
  getUsersController,
  getUserController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils.js";

const router = express.Router();
router.put("/update/:userid", verifyToken, updateUserController);
router.delete("/delete/:userid", verifyToken, deleteUserController);
router.get("/getusers/userid?", verifyToken, getUsersController); //this is the correct one
router.get("/:userid", getUserController);

export default router;
