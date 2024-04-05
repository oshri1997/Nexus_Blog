import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    if (connect.connection.readyState === 1) console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export const hashedPassword = (password) => {
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(password, salt);
};
export const comparePassword = (password, hashedPassword) => {
  return bcryptjs.compareSync(password, hashedPassword);
};
export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next({ message: "Access Denied", statusCode: 401 });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next({ message: "Invalid Token", statusCode: 401 });
    req.user = user;
    next();
  });
};
//refresh token
export const renewToken = (req, res, next) => {
  const refreshtoken = req.cookies.refresh_token;
  if (!refreshtoken) {
    return next({ message: "Please sign in", statusCode: 400 });
  } else {
    jwt.verify(refreshtoken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.next({ message: "Invalid token", statusCode: 400 });
      } else {
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: "1m" }
        );
        res.cookie("access_token", accessToken, {
          httpOnly: true,
          maxAge: 60000,
        });
        const refreshToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: "5m" }
        );
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          maxAge: 300000,
        });
      }
      res.json({ valid: true, message: "Token renewed" });
    });
  }
};
