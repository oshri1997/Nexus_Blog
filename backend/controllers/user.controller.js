import User from "../models/user.model.js";
import { hashedPassword } from "../utils.js";
// Update user in databaseoo
export const updateUserController = async (req, res, next) => {
  if (req.user.id !== req.params.userid) {
    return next({ message: "You are not allowed to update this user", statusCode: 403 });
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next({ message: "Password must be at least 6 characters", statusCode: 400 });
    }
    req.body.password = hashedPassword(req.body.password);
  }

  if (req.body.user) {
    if (req.body.user.length < 7 || req.body.user.length > 20) {
      return next({
        message: "Username must be between 7 and 20 characters",
        statusCode: 400,
      });
    }
    if (req.body.username.includes(" ")) {
      return next({ message: "Username must not contain spaces", statusCode: 400 });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next({ message: "Username must be lowercase", statusCode: 400 });
    }
    if (req.body.username.match(/[^a-zA-Z0-9]/g)) {
      return next({
        message: "Username must contain only letters and numbers",
        statusCode: 400,
      });
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userid,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const userClone = { ...updatedUser._doc };
    delete userClone.password; // remove password from user object
    res.status(200).json(userClone);
  } catch (error) {
    next(error);
  }
};

//delete user from database
export const deleteUserController = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userid) {
    return next({ message: "You are not allowed to delete this user", statusCode: 403 });
  }
  try {
    await User.findByIdAndDelete(req.params.userid);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export const getUsersController = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next({ message: "You are not allowed to get all users", statusCode: 403 });
  try {
    const startIndex = parseInt(req.query.startindex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({
        createdAt: sortDirection,
      })
      .skip(startIndex)
      .limit(limit)
      .select("-password");
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const usersInLastMonth = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ users, totalUsers, usersInLastMonth });
  } catch (error) {
    next(error);
  }
};

export const getUserController = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userid).select("-password");
    if (!user) return next({ message: "User not found", statusCode: 404 });
    res.status(200).json(user);
  } catch (error) {
    next({ message: "User not found", statusCode: 404 });
  }
};
