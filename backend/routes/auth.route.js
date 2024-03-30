import express from "express";
import {
  signUpController,
  signInController,
  googleSignInController,
  signOutController
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/google", googleSignInController);
router.post("/signout", signOutController);

export default router;
