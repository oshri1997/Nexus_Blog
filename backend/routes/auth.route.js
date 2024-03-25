import express from "express";
import {
  signUpController,
  signInController,
  googleSignInController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/google", googleSignInController);

export default router;
