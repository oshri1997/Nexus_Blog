import User from "../models/user.model.js";
import { hashedPassword } from "../utils.js";
export const signUpController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username == "" || email == "" || password == "") {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPass = await hashedPassword(password);
    const user = new User({ username, email, password: hashedPass });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};
