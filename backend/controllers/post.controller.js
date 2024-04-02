import Post from "../models/post.model.js";

export const createController = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next({ status: 401, message: "You are not authorized to create a post" });
  }
  if (!req.body.title || !req.body.content) {
    return next({ status: 400, message: "Please fill in all fields" });
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z-]/g, "-");

  try {
    const post = await new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    }).save();
    console.log(post);
    res.status(201).json(post);
  } catch (error) {
    next({ status: 400, message: error });
  }
};
