import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { comparePassword, hashedPassword } from "../utils.js";
export const signUpController = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password || username == "" || email == "" || password == "") {
    return next({ message: "Please fill in all fields", statusCode: 400 });
  }
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return next({ message: "User already exists", statusCode: 400 });
    }
    const hashedPass = hashedPassword(password);
    const user = new User({ username, email, password: hashedPass });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signInController = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email == "" || password == "") {
    return next({ message: "Please fill in all fields", statusCode: 400 });
  }
  try {
    const emailExists = await User.findOne({ email });
    if (!emailExists) {
      return next({ message: "Email does not exist", statusCode: 400 });
    }
    const passwordMatch = comparePassword(password, emailExists.password);
    if (!passwordMatch) {
      return next({ message: "Invalid password", statusCode: 400 });
    }
    const userClone = { ...emailExists._doc };
    delete userClone.password; // remove password from user object
    const token = jwt.sign({ id: emailExists._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(userClone);
  } catch (error) {
    next(error);
  }
};
