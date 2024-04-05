import express from "express";
import {
  signUpController,
  signInController,
  googleSignInController,
  signOutController,
  refreshTokenController,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/google", googleSignInController);
router.post("/signout", signOutController);
router.get("/refresh-token", refreshTokenController);

export default router;
