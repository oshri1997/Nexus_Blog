import User from "../models/user.model.js";
import { hashedPassword } from "../utils.js";
export const signUpController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username == "" || email == "" || password == "") {
      return next({ message: "Please fill in all fields", statusCode: 400 });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      return next({ message: "User already exists", statusCode: 400 });
    }
    const hashedPass = await hashedPassword(password);
    const user = new User({ username, email, password: hashedPass });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};
