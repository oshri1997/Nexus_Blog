import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { comparePassword, hashedPassword, renewToken } from "../utils.js";

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
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return next({ message: "Email does not exist", statusCode: 400 });
    }
    const passwordMatch = comparePassword(password, userExists.password);
    if (!passwordMatch) {
      return next({ message: "Invalid password", statusCode: 400 });
    }
    const userClone = { ...userExists._doc };
    delete userClone.password; // remove password from user object
    const accessToken = jwt.sign(
      { id: userExists._id, isAdmin: userExists.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const refreshToken = jwt.sign(
      { id: userExists._id, isAdmin: userExists.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "8d" }
    );
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 604800000, // 7 days in milliseconds
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 691200000, // 8 days in milliseconds
    });
    res.status(200).json(userClone);
  } catch (error) {
    next(error);
  }
};

export const googleSignInController = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  if (!email || !name || email == "" || name == "") {
    return next({ message: "Please fill in all fields", statusCode: 400 });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET);
      const userClone = { ...userExists._doc };
      delete userClone.password;
      res.status(200).cookie("access_token", token, { httpOnly: true }).json(userClone);
    } else {
      const generetedPassword = hashedPassword(email);
      const user = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4), //
        email,
        password: generetedPassword,
        profilePicture: googlePhotoUrl,
      });
      await user.save();
      const userClone = { ...user._doc };
      delete userClone.password;
      const accessToken = jwt.sign(
        { id: userExists._id, isAdmin: userExists.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      const refreshToken = jwt.sign(
        { id: userExists._id, isAdmin: userExists.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "8d" }
      );
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 604800000, // 7 days in milliseconds
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 691200000, // 8 days in milliseconds
      });
      res.status(200).json(userClone);
    }
  } catch (error) {
    next(error);
  }
};
export const signOutController = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token").status(200).json({ message: "Sign out successful" });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (req, res, next) => {
  const accesstoken = req.cookies.access_token;
  if (!accesstoken) {
    return renewToken(req, res, next);
  } else {
    jwt.verify(accesstoken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next({ message: "Invalid token", statusCode: 400 });
      } else {
        req.user = user;
      }
    });
  }
};
